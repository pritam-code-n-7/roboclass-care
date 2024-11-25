import { Appointment } from "../model/appointmentModel";

export async function createAppointments(appointment) {
  try {
    await Appointment.create(appointment);
  } catch (error) {
    throw new Error(error);
  }
}
