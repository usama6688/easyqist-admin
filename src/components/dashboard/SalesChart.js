import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import { useChartDataQuery } from "../../services/Api";
import { useEffect } from "react";

const SalesChart = () => {
  const { data: chartData, refetch: chartDataRefetch } = useChartDataQuery();

  const totalOrders = chartData?.data?.map(item => item.totalOrder);
  const dates = chartData?.data?.map(item => item.date);

  const chartoptions = {
    series: [
      {
        name: "Total Orders",
        data: totalOrders,
      }
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: dates,
      },
    },
  };

  useEffect(() => {
    chartDataRefetch();
  }, []);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        ></Chart>
      </CardBody>
    </Card>
  );
};

export default SalesChart;

