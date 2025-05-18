import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function HomePage() {
  const timeRef = useRef();
  const studentCountRef = useRef();
  const tasksCountRef = useRef();
  const projectsBoxRef = useRef();
  const studentsBoxRef = useRef();
  const chartRef = useRef(); 

  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    updateCounts();

    return () => {
      clearInterval(timer);
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const updateTime = () => {
    const currentDate = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    if (timeRef.current) {
      timeRef.current.innerHTML = currentDate.toLocaleString('en-US', options);
    }
  };

  const getCurrentUser = () => {
    return (
      JSON.parse(localStorage.getItem('currentUser')) ||
      JSON.parse(sessionStorage.getItem('currentUser'))
    );
  };

  const updateCounts = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const projects = window.fakeProjectsData || [];

    const isStudent = currentUser.role === 'Student';

    const tasksCount = isStudent
      ? tasks.filter((task) => task.student === currentUser.username).length
      : tasks.filter((task) => task.createdBy === currentUser.username).length;

    const projectsCount = isStudent
      ? projects.filter((p) =>
          p.students.toLowerCase().includes(currentUser.username.toLowerCase())
        ).length
      : projects.filter((p) => p.createdBy === currentUser.username).length;

    const finishedProjectsCount = isStudent
      ? projects.filter(
          (p) =>
            p.students.toLowerCase().includes(currentUser.username.toLowerCase()) &&
            p.status.toLowerCase() === 'completed'
        ).length
      : projects.filter(
          (p) =>
            p.createdBy === currentUser.username &&
            p.status.toLowerCase() === 'completed'
        ).length;

    const studentCount = parseInt(localStorage.getItem('studentCount')) || 0;

    if (projectsBoxRef.current)
      projectsBoxRef.current.querySelector('p').textContent = projectsCount;
    if (studentCountRef.current) studentCountRef.current.textContent = studentCount;
    if (tasksCountRef.current) tasksCountRef.current.textContent = tasksCount;

    localStorage.setItem('projectsCount', projectsCount);
    localStorage.setItem('tasksCOUNT', tasksCount);
    localStorage.setItem('finishedProjectsCount', finishedProjectsCount);

    drawChart({ projectsCount, tasksCount, finishedProjectsCount, studentCount }, isStudent);
  };

  const drawChart = (counts, isStudent) => {
    const canvas = document.getElementById('myChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const data = isStudent
      ? {
          labels: ['Projects', 'Tasks', 'Finished Projects'],
          values: [counts.projectsCount, counts.tasksCount, counts.finishedProjectsCount],
          colors: ['#356c6c', '#9a7f3d', '#62459b'],
          borders: ['#419797', '#fee25d', '#8c5fe6'],
        }
      : {
          labels: ['Projects', 'Students', 'Tasks', 'Finished Projects'],
          values: [
            counts.projectsCount,
            counts.studentCount,
            counts.tasksCount,
            counts.finishedProjectsCount,
          ],
          colors: ['#356c6c', '#28506b', '#9a7f3d', '#62459b'],
          borders: ['#419797', '#3387c1', '#fee25d', '#8c5fe6'],
        };

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Count',
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
      },
    });

    if (isStudent && studentsBoxRef.current) {
      studentsBoxRef.current.style.display = 'none';
    }
  };


  return (
    <div className="text-white overflow-hidden min-h-screen ">

<div className="flex justify-between items-center mb-[30px] mt-[0] font-bold pt-[20px] text-[#0574ee]">
        <h1 className="text-[1.5em] ml-[30px] mt-[-0px]">Welcome to the Task Management System</h1>
        <p ref={timeRef} className="text-white text-[18px] mr-[220px]"></p>
      </div>

      <div className="flex justify-start mb-[50px] gap-[60px] ml-[50px]">
        <div
          ref={projectsBoxRef}
          className="bg-[#2a2a2a] p-[25px] rounded text-center w-[210px] h-[110px] shadow-md flex flex-col justify-center items-center"
        >
          <h3 className="text-[18px] text-[#ddd]">Number of Projects</h3>
          <p className="text-[#eee]">0</p>
        </div>
        <div
          ref={studentsBoxRef}
          className="bg-[#2a2a2a] p-[25px] rounded text-center w-[210px] h-[110px] shadow-md flex flex-col justify-center items-center"
        >
          <h3 className="text-[18px] text-[#ddd]">Number of Students</h3>
          <p ref={studentCountRef} className="text-[#eee]">0</p>
        </div>
        <div
          className="bg-[#2a2a2a] p-[25px] rounded text-center w-[210px] h-[110px] shadow-md flex flex-col justify-center items-center"
        >
          <h3 className="text-[18px] text-[#ddd]">Number of Tasks</h3>
          <p ref={tasksCountRef} className="text-[#eee] pb-[30px]">0</p>
        </div>
        <div className="bg-[#2a2a2a] p-[25px] rounded text-center w-[210px] h-[110px] shadow-md flex flex-col justify-center items-center">
          <h3 className="text-[18px] text-[#ddd]">Number of Finished Projects</h3>
          <p>{localStorage.getItem('finishedProjectsCount') || 0}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="mt-[-20px] text-[#666666] text-[13px] ml-[450px]">Admin Dashboard Overview</h2>
        <div className="flex mt-[20px] ml-[500px] items-center gap-[8px]">
          <span className="w-[50px] h-[13px] bg-[#174d4d] border border-[#4cc4c3]"></span>
          <span className="text-[#666666] text-[14px] font-medium">Count</span>
        </div>
      <canvas id="myChart" className="w-[1100px] h-[360px] mx-auto ml-[20px]"></canvas>
      </div>
    </div>
  );
}
