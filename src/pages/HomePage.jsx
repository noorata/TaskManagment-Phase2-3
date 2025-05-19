import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  /* مراجع العناصر */
  const timeRef = useRef();
  const studentCountRef = useRef();
  const tasksCountRef = useRef();
  const projectsBoxRef = useRef();
  const studentsBoxRef = useRef();
  const chartRef = useRef();

  /* المستخدم الحالي من سياق المصادقة */
  const { user: currentUser } = useAuth();

  /* تحديث التاريخ والوقت كل ثانية */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      if (timeRef.current) {
        timeRef.current.textContent = now.toLocaleString("en-US", options);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  /* حساب الإحصاءات ورسم المخطط كلما تغيّر المستخدم */
  useEffect(() => {
    if (!currentUser) return; // لم يكتمل تحميل المستخدم بعد

    /* ==== حساب الأرقام ==== */
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const projects = window.fakeProjectsData || [];

    const isStudent =
      (currentUser.role || "").toString().toLowerCase() === "student";

    const tasksCount = isStudent
      ? tasks.filter((t) => t.student === currentUser.username).length
      : tasks.filter((t) => t.createdBy === currentUser.username).length;

    const projectsCount = isStudent
      ? projects.filter((p) =>
          p.students.toLowerCase().includes(currentUser.username.toLowerCase())
        ).length
      : projects.filter((p) => p.createdBy === currentUser.username).length;

    const finishedProjectsCount = isStudent
      ? projects.filter(
          (p) =>
            p.students
              .toLowerCase()
              .includes(currentUser.username.toLowerCase()) &&
            p.status.toLowerCase() === "completed"
        ).length
      : projects.filter(
          (p) =>
            p.createdBy === currentUser.username &&
            p.status.toLowerCase() === "completed"
        ).length;

    const studentCount = parseInt(localStorage.getItem("studentCount")) || 0;

    /* ==== تحديث صناديق الإحصاءات في الواجهة ==== */
    if (projectsBoxRef.current)
      projectsBoxRef.current.querySelector("p").textContent = projectsCount;
    if (studentCountRef.current)
      studentCountRef.current.textContent = studentCount;
    if (tasksCountRef.current) tasksCountRef.current.textContent = tasksCount;

    /* نخزنها محلياً (اختياري) */
    localStorage.setItem("projectsCount", projectsCount);
    localStorage.setItem("tasksCOUNT", tasksCount);
    localStorage.setItem("finishedProjectsCount", finishedProjectsCount);

    /* ==== رسم المخطط ==== */
    drawChart(
      { projectsCount, tasksCount, finishedProjectsCount, studentCount },
      isStudent
    );

    /* إتلاف المخطط عند تغيّر المستخدم أو عند إزالة الصفحة */
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [currentUser]);

  /* رسم المخطط بالأرقام المحسوبة */
  const drawChart = (counts, isStudent) => {
    const canvas = document.getElementById("myChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (chartRef.current) chartRef.current.destroy();

    const data = isStudent
      ? {
          labels: ["Projects", "Tasks", "Finished Projects"],
          values: [
            counts.projectsCount,
            counts.tasksCount,
            counts.finishedProjectsCount,
          ],
          colors: ["#356c6c", "#9a7f3d", "#62459b"],
          borders: ["#419797", "#fee25d", "#8c5fe6"],
        }
      : {
          labels: ["Projects", "Students", "Tasks", "Finished Projects"],
          values: [
            counts.projectsCount,
            counts.studentCount,
            counts.tasksCount,
            counts.finishedProjectsCount,
          ],
          colors: ["#356c6c", "#28506b", "#9a7f3d", "#62459b"],
          borders: ["#419797", "#3387c1", "#fee25d", "#8c5fe6"],
        };

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Count",
            data: data.values,
            backgroundColor: data.colors.map((c) => `${c}66`),
            borderColor: data.borders,
            borderWidth: 1,
          },
        ],
      },
      options: {
        layout: { padding: 15 },
        scales: {
          y: {
            beginAtZero: true,
            max: 20,
            ticks: { stepSize: 2, font: { size: 13 } },
          },
          x: { ticks: { font: { size: 13 } } },
        },
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    /* إخفاء صندوق الطلاب إذا كان المستخدم طالبًا */
    if (isStudent && studentsBoxRef.current) {
      studentsBoxRef.current.style.display = "none";
    } else if (studentsBoxRef.current) {
      studentsBoxRef.current.style.display = "flex";
    }
  };

  /* ================= الواجهة ================= */
  return (
    <div className="min-h-screen overflow-hidden text-white">
      {/* العنوان والتاريخ */}
      <div className="flex items-center justify-between pt-5 font-bold text-[#0574ee]">
        <h1 className="ml-8 text-[1.5em]">
          Welcome to the Task Management System
        </h1>
        <p ref={timeRef} className="mr-[220px] text-[18px] text-white"></p>
      </div>

      {/* صناديق الإحصاءات */}
      <div className="ml-[50px] mb-[50px] mt-8 flex gap-[60px]">
        {/* المشاريع */}
        <div
          ref={projectsBoxRef}
          className="flex h-[110px] w-[210px] flex-col items-center justify-center rounded bg-[#2a2a2a] p-[25px] text-center shadow-md"
        >
          <h3 className="text-[18px] text-[#ddd]">Number of Projects</h3>
          <p className="text-[#eee]">0</p>
        </div>

        {/* الطلاب */}
        <div
          ref={studentsBoxRef}
          className="flex h-[110px] w-[210px] flex-col items-center justify-center rounded bg-[#2a2a2a] p-[25px] text-center shadow-md"
        >
          <h3 className="text-[18px] text-[#ddd]">Number of Students</h3>
          <p ref={studentCountRef} className="text-[#eee]">
            0
          </p>
        </div>

        {/* المهام */}
        <div className="flex h-[110px] w-[210px] flex-col items-center justify-center rounded bg-[#2a2a2a] p-[25px] text-center shadow-md">
          <h3 className="text-[18px] text-[#ddd]">Number of Tasks</h3>
          <p ref={tasksCountRef} className="pb-[30px] text-[#eee]">
            0
          </p>
        </div>

        {/* المشاريع المنتهية */}
        <div className="flex h-[110px] w-[210px] flex-col items-center justify-center rounded bg-[#2a2a2a] p-[25px] text-center shadow-md">
          <h3 className="text-[18px] text-[#ddd]">Number of Finished Projects</h3>
          <p>{localStorage.getItem("finishedProjectsCount") || 0}</p>
        </div>
      </div>

      {/* مخطط الأعمدة */}
      <div className="chart-container relative h-[360px] w-full max-w-[1100px] px-5">
        <h2 className="ml-[450px] -mt-5 text-[13px] text-[#666666]">
          Admin Dashboard Overview
        </h2>
        <div className="ml-[500px] mt-5 flex items-center gap-2">
          <span className="h-[13px] w-[50px] bg-[#174d4d] border border-[#4cc4c3]"></span>
          <span className="text-[14px] font-medium text-[#666666]">Count</span>
        </div>
        <canvas id="myChart" className="mx-auto mt-4 h-full w-full"></canvas>
      </div>
    </div>
  );
}
