import * as d3 from "d3";
import styles from "./Chart.module.scss";

import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";

function BubbelChartFilter() {
  const { countedDate, setValueDate } = useDataContext();
  const [dataList, setDataList] = useState();
  var diameter = 550;

  console.log("dateFirst", countedDate);

  useEffect(() => {
    var root = d3
      .hierarchy(countedDate)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    const dataBubble = bubble(root);

    console.log("date", root.children);
    setDataList(root.children);
  }, [countedDate]);

  if (countedDate) {
    var colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(countedDate.children, function (d) {
          return d.value;
        }),
      ])
      .range(["rgb(233,150,122)", "	rgb(139,0,0)"]);
  }

  var bubble = d3.pack().size([diameter, diameter]).padding(5);

  const handleClick = (value) => {
    setValueDate(value);
  };

  if (!dataList) {
    return <p>No items to display</p>;
  }

  return (
    <svg className="chart-svg" width={diameter} height={diameter}>
      {dataList.map((item, index) => (
        <g
          className={styles.node}
          key={index}
          transform={`translate(${item.x + " " + item.y})`}
        >
          <g
            className={styles.graph}
            onClick={() => handleClick(item.data.function)}
          >
            <circle r={item.r} style={{ fill: `${colorScale(item.value)}` }} />
            <text
              dy=".3em"
              style={{ textAnchor: "middle", fill: "rgb(255, 255, 255)" }}
            >
              {item.data.name}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
export default BubbelChartFilter;
