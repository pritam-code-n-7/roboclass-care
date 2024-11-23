import { model, models, Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    date: {
      required: true,
      type: Date,
    },
    name: {
      required: true,
      type: String,
    },
    contact: {
      required: true,
      type: String,
    },
    course: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = models.Appointment ?? model("Appointment", appointmentSchema);
