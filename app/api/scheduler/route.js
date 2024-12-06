"use server";
import { createAppointments } from "../../../queries/appointments";
import { dbConnect } from "../../../lib/mongo";
import { NextResponse } from "next/server";

// import moment from "moment-timezone";
import cron from "node-cron";
import axios from "axios";

import moment from "moment-timezone";

export const POST = async (request) => {
  const { date, userName, destination, course, time, items } =
    await request.json();

  console.log(date, userName, destination, course, time, items);

  // Create a db connection
  await dbConnect();

  // Form a db payload
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

  // Helper: scheduler
  async function scheduleReminders(appointment) {
    const { time, date, userName, destination } = appointment;

    // Combine date and time in Indian timezone
    const indianDateTime = moment.tz(
      `${date} ${time}`,
      "YYYY-MM-DD HH:mm",
      "Asia/Kolkata"
    );

    // Convert Indian timezone to Dubai timezone
    const dubaiDateTime = indianDateTime.clone().tz("Asia/Dubai");

    // Subtract 24 hours from the Dubai time
    const reminderDateTime = dubaiDateTime.clone().subtract(24, "hours");

    console.log("Indian Time (Appointment):", indianDateTime.format());
    console.log("Dubai Time (Appointment):", dubaiDateTime.format());
    console.log("Dubai Time (Reminder):", reminderDateTime.format());

    // Extract components for the cron expression
    const minute = reminderDateTime.minute();
    const hour = reminderDateTime.hour();
    const day = reminderDateTime.date();
    const month = reminderDateTime.month() + 1; // Months are 0-based

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

    //find the selected item from an array
    // const selectedItem = items?.find(
    //   (item) => item.id === "1hour" || item.id === "24hours"
    // );

    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: "Trial_Class_Demo_24_hour",
      destination,
      userName,
    };

    console.log("Payload is" + JSON.stringify(payload, null, 2));

    try {
      const res = await axios.post(
        `${AISENSY_BASE_URL}`,
        payload
        //  { headers: { Authorization: `Bearer ${AISENSY_API_KEY}` } }
      );

      const currentTime = new Date().toLocaleString();

      console.log(`reminder sent successfully on ${currentTime}` + res.data);
    } catch (error) {
      console.error("Failed to send reminder", error);
    }
  };

  return new NextResponse("Appointment has been created", {
    status: 201,
  });
};
