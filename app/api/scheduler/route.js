"use server";
import { createAppointments } from "../../../queries/appointments";
import { dbConnect } from "../../../lib/mongo";
import { NextResponse } from "next/server";

import cron from "node-cron";
import axios from "axios";

export const POST = async (request) => {
  const { date, name, contact, course, time } = request.json();

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
    const res = await createAppointments(newAppointment);
    await scheduleReminders(res);
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }

  const scheduleReminders = async (appointment) => {
    const { date, name, contact } = appointment;

    //calculate reminder times
    const date24HoursBefore = new Date(date);
    date24HoursBefore.setHours(date24HoursBefore.getHours() - 24);

    const date1HourBefore = new Date(date);
    date24HoursBefore.setHours(date1HourBefore.getHours() - 1);

    // Schedule 24hours reminder
    cron.schedule(getCronExpression(date24HoursBefore), () => {
      sendReminder(name, contact, "24 hours").catch((e) =>
        console.error("send reminder error" + e)
      );
    });

    // Schedule 1hour reminder
    cron.schedule(getCronExpression(date1HourBefore), () => {
      sendReminder(name, contact, "1 hour").catch((e) =>
        console.error("send reminder error" + e)
      );
    });
  };

  //Helper: send whatsapp reminder
  const sendReminder = async (time, name, contact) => {
    const { AISENSY_API_KEY, AISENSY_BASE_URL } = process.env;

    const messages = [
      {
        to: contact,
        body: `Hi ${name}, this is a reminder for your appointment scheduled in ${time}`,
      },
    ];

    for (const message of messages) {
      try {
        await axios.post(
          `${AISENSY_BASE_URL}v1/message`,
          { to: message.to, body: message.body },
          { headers: { Authorization: `Bearer ${AISENSY_API_KEY}` } }
        );

        console.log(`reminder sent to ${message.to}`);
      } catch (error) {
        console.error(`Failed to send reminder to ${message.to}:`, error);
      }
    }
  };

  // Helper: Convert data to cron expression
  // const getCronExpression = (date) => {
  //   const [minute, hour, day, month, dayOfWeek] = [
  //     date.getMinutes(),
  //     date.getHours(),
  //     date.getDate(),
  //     date.getMonth() + 1,
  //     "*",
  //   ];

  //   return `${minute} ${hour} ${day} ${month} ${dayOfWeek}`;
  // };

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
