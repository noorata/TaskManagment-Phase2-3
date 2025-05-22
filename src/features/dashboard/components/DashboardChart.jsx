import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DashboardChart({ data, isStudent }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* هدِم الرسم السابق */
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const datasets = isStudent
      ? {
          labels: ["Projects", "Tasks", "Finished Projects"],
          values: [data.projectCount, data.taskCount, data.finishedProjectsCount],
          colors: ["#356c6c", "#9a7f3d", "#62459b"],
          borders: ["#419797", "#fee25d", "#8c5fe6"],
        }
      : {
          labels: [
            "Projects",
            "Students",
            "Tasks",
            "Finished Projects",
          ],
          values: [
            data.projectCount,
            data.studentCount,
            data.taskCount,
            data.finishedProjectsCount,
          ],
          colors: ["#356c6c", "#28506b", "#9a7f3d", "#62459b"],
          borders: ["#419797", "#3387c1", "#fee25d", "#8c5fe6"],
        };

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: datasets.labels,
        datasets: [
          {
            label: "Count",
            data: datasets.values,
            backgroundColor: datasets.colors.map((c) => `${c}66`),
            borderColor: datasets.borders,
            borderWidth: 1,
          },
        ],
      },
      options: {
        layout: { padding: 15 },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 2 } },
        },
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [data, isStudent]);

  return (
    <div className="chart-container relative h-[360px] w-full max-w-[1100px] px-5">
      <h2 className="text-center text-sm text-[#666]">
        {isStudent ? "Student Overview" : "Admin Dashboard Overview"}
      </h2>
      <canvas ref={canvasRef} className="mx-auto mt-4 h-full w-full" />
    </div>
  );
}
