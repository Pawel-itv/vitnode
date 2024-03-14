"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import { useTranslations } from "next-intl";
import { Line } from "react-chartjs-2";

export const SignUpStatsDashboardCoreAdmin = () => {
  const t = useTranslations("core");

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const labels = [
    t("weeks.monday"),
    t("weeks.tuesday"),
    t("weeks.wednesday"),
    t("weeks.thursday"),
    t("weeks.friday"),
    t("weeks.saturday"),
    t("weeks.sunday")
  ];

  const primaryColor =
    typeof window !== "undefined"
      ? getComputedStyle(document.body).getPropertyValue("--primary")
      : "";

  return (
    <Line
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }}
      data={{
        labels,
        datasets: [
          {
            fill: true,
            label: "Dataset 2",
            data: labels.map(() => Math.random() * 100),
            borderColor: `hsl(${primaryColor} )`,
            backgroundColor: `hsl(${primaryColor} / 20% )`
          }
        ]
      }}
    />
  );
};
