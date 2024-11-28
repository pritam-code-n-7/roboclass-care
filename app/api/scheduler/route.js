"use server";
import { createAppointments } from "../../../queries/appointments";
import { dbConnect } from "../../../lib/mongo";
import { NextResponse } from "next/server";

// import moment from "moment-timezone";
import cron from "node-cron";
import axios from "axios";

export const POST = async (request) => {
  const { date, userName, destination, course, time, items } = await request.json();

  console.log(date, userName, destination, course, time);

  //Create a db connection
  await dbConnect();

  //Form a db payload
  const newAppointment = {
    date,
    userName,
    destination,
    course,
    time,
    items,
  };

  try {
    await createAppointments(newAppointment);
    await scheduleReminders(newAppointment);
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  //Helper: scheduler
  async function scheduleReminders(appointment) {
    const { date, userName, destination } = appointment;

    // Calculate the reminder time (1 hour before the appointment time)
    const dateOneHourBefore = new Date(date);
    dateOneHourBefore.setHours(dateOneHourBefore.getHours() - 1);

    console.log(dateOneHourBefore);
    

    // Extract components for cron expression
    const minute = dateOneHourBefore.getMinutes();
    const hour = dateOneHourBefore.getHours();
    const day = dateOneHourBefore.getDate();
    const month = dateOneHourBefore.getMonth() + 1;

    const cronExpression = `${minute} ${hour} ${day} ${month} *`;

    // Schedule 1-hour reminder
    cron.schedule(
      cronExpression,
      () => {
        console.log(cronExpression);

        sendReminder(userName, destination).catch((e) =>
          console.error("send reminder error", e)
        );
      },
      {
        scheduled: true,
        timezone: "Asia/Dubai",
      }
    );
  }

  //Helper: send whatsapp reminder
  const sendReminder = async (userName, destination) => {
    const { AISENSY_API_KEY, AISENSY_BASE_URL } = process.env;

    console.log("base url" + AISENSY_BASE_URL);
    console.log("api key" + AISENSY_API_KEY);

    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: "Trial_Class_Demo_1_hour",
      destination: destination,
      userName: userName,
    };

    console.log("Payload is" + payload);

    try {
      const res = await axios.post(
        `${AISENSY_BASE_URL}`,
        payload
        //  { headers: { Authorization: `Bearer ${AISENSY_API_KEY}` } }
      );

      console.log("reminder sent successfully" + res.data);
    } catch (error) {
      console.error("Failed to send reminder", error);
    }
  };

  //Helper: cron expression
  // function getCronExpression(date) {
  //   const minute = date.getMinutes();
  //   const hour = date.getHours();
  //   const day = date.getDate();
  //   const month = date.getMonth() + 1;
  //   return `${minute} ${hour} ${day} ${month} *`;
  // }

  return new NextResponse("Appointment has been created", {
    status: 201,
  });
};
