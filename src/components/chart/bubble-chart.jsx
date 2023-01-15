import * as d3 from "d3";
import styles from "./Chart.module.scss";

import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";

// const json = {
//   children: emails
// }

function BubbleChart() {
  const json = {
    children: [
      { name: "Apples", value: 70 },
      { name: "Oranges", value: 44 },
      { name: "Kiwis", value: 65 },
      { name: "Bananas", value: 39 },
      { name: "Pears", value: 10 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Apples", value: 70 },
      { name: "Oranges", value: 44 },
      { name: "Kiwis", value: 65 },
      { name: "Bananas", value: 39 },
      { name: "Pears", value: 10 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Apples", value: 70 },
      { name: "Oranges", value: 44 },
      { name: "Kiwis", value: 65 },
      { name: "Bananas", value: 39 },
      { name: "Pears", value: 10 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Apples", value: 70 },
      { name: "Oranges", value: 44 },
      { name: "Kiwis", value: 65 },
      { name: "Bananas", value: 39 },
      { name: "Pears", value: 10 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
      { name: "Apples", value: 70 },
      { name: "Oranges", value: 44 },
      { name: "Kiwis", value: 65 },
      { name: "Bananas", value: 39 },
      { name: "Pears", value: 10 },
      { name: "Satsumas", value: 25 },
      { name: "Pineapples", value: 30 },
    ],
  };

  const { dataMessages } = useDataContext();

  const [dataList, setDataList] = useState();

  useEffect(() => {
    console.log(dataMessages);
    var root = d3
      .hierarchy(dataMessages)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    const dataBubble = bubble(root);

    console.log(root);

    setDataList(root.children);
  }, [dataMessages]);

  var diameter = 400;

  var colorScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataMessages.children, function (d) {
        return d.value;
      }),
    ])
    .range(["rgb(233,150,122)", "	rgb(139,0,0)"]);

  var bubble = d3.pack().size([diameter, diameter]).padding(5);

  console.log(dataList);

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
          <g className={styles.graph}>
            <circle r={item.r} style={{ fill: `${colorScale(item.value)}` }} />
            <text
              dy=".3em"
              style={{ textAnchor: "middle", fill: "rgb(255, 255, 255)" }}
            >
              {item.value}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
export default BubbleChart;
