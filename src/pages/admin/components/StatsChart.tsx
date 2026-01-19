import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useMusicStore } from "@/stores/useMusicStore";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

const StatsChart = () => {
	const { stats } = useMusicStore();

	// Cấu hình dữ liệu cho Bar Chart (Tổng quan)
	const barData = {
		labels: ["Total Songs", "Total Albums", "Total Artists", "Total Users"],
		datasets: [
			{
				label: "Counts",
				data: [
					stats.totalSongs,
					stats.totalAlbums,
					stats.totalArtists,
					stats.totalUsers,
				],
				backgroundColor: [
					"rgba(16, 185, 129, 0.8)", // Emerald
					"rgba(139, 92, 246, 0.8)", // Violet
					"rgba(249, 115, 22, 0.8)", // Orange
					"rgba(14, 165, 233, 0.8)", // Sky
				],
				borderColor: [
					"rgba(16, 185, 129, 1)",
					"rgba(139, 92, 246, 1)",
					"rgba(249, 115, 22, 1)",
					"rgba(14, 165, 233, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false, // Ẩn chú thích vì label trục X đã rõ
			},
			title: {
				display: true,
				text: "System Overview",
				color: "#e4e4e7", // zinc-200
				font: { size: 16 },
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: { color: "rgba(255, 255, 255, 0.1)" },
				ticks: { color: "#a1a1aa" },
			},
			x: {
				grid: { color: "rgba(255, 255, 255, 0.1)" },
				ticks: { color: "#a1a1aa" },
			},
		},
	};

	// Cấu hình dữ liệu cho Doughnut Chart (Tỉ lệ nội dung)
	const doughnutData = {
		labels: ["Songs", "Albums"],
		datasets: [
			{
				data: [stats.totalSongs, stats.totalAlbums],
				backgroundColor: [
					"rgba(16, 185, 129, 0.8)", // Emerald
					"rgba(139, 92, 246, 0.8)", // Violet
				],
				borderColor: [
					"rgba(16, 185, 129, 1)",
					"rgba(139, 92, 246, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
				labels: { color: "#e4e4e7" },
			},
			title: {
				display: true,
				text: "Content Distribution",
				color: "#e4e4e7",
				font: { size: 16 },
			},
		},
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
			{/* Bar Chart chiếm 2 phần */}
			<div className='bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 col-span-1 lg:col-span-2 h-80'>
				<Bar data={barData} options={barOptions} />
			</div>

			{/* Doughnut Chart chiếm 1 phần */}
			<div className='bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 col-span-1 h-80 flex items-center justify-center'>
				<div className='w-full h-full'>
					<Doughnut data={doughnutData} options={doughnutOptions} />
				</div>
			</div>
		</div>
	);
};

export default StatsChart;