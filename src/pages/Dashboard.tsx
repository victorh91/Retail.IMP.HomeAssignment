import { ResponsiveLine } from "@nivo/line";

const chartdata = [
  {
    id: "SolarPanels",
    data: [
      { x: "Jan 22", y: 2890 },
      { x: "Feb 22", y: 2756 },
      { x: "Mar 22", y: 3322 },
    ],
  },
  {
    id: "Inverters",
    data: [
      { x: "Jan 22", y: 2338 },
      { x: "Feb 22", y: 2103 },
      { x: "Mar 22", y: 2194 },
    ],
  },
];

export const Dashboard = () => {
  fetch("/api/weather/forecast").then((r) => console.log(r));

  return (
    <>
      <div>
        <div className="w-full h-24">
          <input type="date"></input>
        </div>
        <ChartComponent />
      </div>
    </>
  );
};

function ChartComponent() {
  return (
    <div className="w-96 h-64">
      <h3 className="text-sm text-gray-500">Newsletter Revenue</h3>
      <p className="text-3xl text-gray-900 font-semibold">$34,567</p>
      <div className="mt-4 h-72">
        <ResponsiveLine
          data={chartdata}
          margin={{ top: 30, right: 20, bottom: 30, left: 65 }}
          yScale={{ type: "linear", min: 0, max: "auto" }}
          colors={["#6366f1", "#06b6d4"]}
          enableArea
          areaOpacity={0.2}
          enableGridX={false}
          axisLeft={{ tickSize: 0, tickPadding: 8 }}
          axisBottom={{ tickSize: 0, tickPadding: 8 }}
          pointSize={6}
          useMesh
          legends={[
            {
              anchor: "top-right",
              direction: "row",
              translateY: -30,
              itemWidth: 90,
              itemHeight: 20,
              symbolShape: "circle",
              symbolSize: 10,
            },
          ]}
        />
      </div>
    </div>
  );
}