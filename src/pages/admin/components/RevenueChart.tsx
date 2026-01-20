import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { useMemo } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueChart = () => {
    const { payments } = usePaymentStore();

    // Xử lý dữ liệu: Tính doanh thu 7 ngày gần nhất
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split("T")[0]; // YYYY-MM-DD
        });

        const revenueByDay = last7Days.map((date) => {
            return payments
                .filter(
                    (p) =>
                        p.status === "SUCCESS" &&
                        p.createdAt.split("T")[0] === date
                )
                .reduce((sum, p) => sum + p.amount, 0);
        });

        return {
            labels: last7Days.map(date => {
                const [ , m, d] = date.split('-');
                return `${d}/${m}`;
            }),
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data: revenueByDay,
                    borderColor: "rgba(16, 185, 129, 1)", // Emerald-500
                    backgroundColor: "rgba(16, 185, 129, 0.2)", // Emerald mờ
                    tension: 0.4, // Đường cong mềm mại
                    fill: true,
                    pointBackgroundColor: "rgba(16, 185, 129, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(16, 185, 129, 1)",
                },
            ],
        };
    }, [payments]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Doanh thu 7 ngày qua",
                color: "#e4e4e7",
                font: { size: 16 },
                align: "start" as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                backgroundColor: "rgba(24, 24, 27, 0.9)", // zinc-900
                titleColor: "#10b981",
                bodyColor: "#fff",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        return context.parsed.y.toLocaleString('vi-VN') + ' đ';
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255, 255, 255, 0.05)" },
                ticks: { color: "#a1a1aa", callback: (value: any) => value / 1000 + 'k' },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#a1a1aa" },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <div className='bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 h-80 w-full shadow-lg'>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default RevenueChart;