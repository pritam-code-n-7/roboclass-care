"use server";
import { createAppointments } from "../../../queries/appointments";
import { dbConnect } from "../../../lib/mongo";
import { NextResponse } from "next/server";

import cron from "node-cron";
import axios from "axios";

export const POST = async (request) => {
  const { date, name, contact, course, time } = await request.json();

  console.log(date, name, contact, course, time);

  //Create a db connection
  await dbConnect();

  //Form a db payload
  const newAppointment = {
    date,
    name,
    contact,
    course,
    time,
  };

  try {
    await createAppointments(newAppointment);
    const res = await scheduleReminders(newAppointment);

    console.log(res);
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  //Helper: scheduler
  async function scheduleReminders(appointment) {
    const { date, name, contact } = appointment;

    const date1HourBefore = new Date(date);
    date1HourBefore.setHours(date1HourBefore.getHours() - 1);

    // Schedule 1-hour reminder
    cron.schedule(getCronExpression(date1HourBefore), async () => {
      await sendReminder( name, contact).catch((e) =>
        console.error("send reminder error", e)
      );
    });
  }

  //Helper: send whatsapp reminder
  const sendReminder = async ( name, contact) => {
    const { AISENSY_API_KEY, AISENSY_BASE_URL } = process.env;

    const payload = {
      apiKey: AISENSY_API_KEY,
      campaignName: "Trial_Class_Demo_1_hour",
      destination: contact,
      userName: name,
    };


      try {
        const res = await axios.post(
          `${AISENSY_BASE_URL}`, payload
          // { headers: { Authorization: `Bearer ${AISENSY_API_KEY}` } }
        );

        console.log('reminder sent successfully'+res.data);
      } catch (error) {
        console.error('Failed to send reminder', error);
      }
    
  };

  //Helper: cron expression
  function getCronExpression(date) {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${minute} ${hour} ${day} ${month} *`;
  }

  return new NextResponse("Appointment has been created", {
    status: 201,
  });
};
