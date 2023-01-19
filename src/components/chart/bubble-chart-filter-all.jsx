import * as d3 from "d3";
import styles from "./Chart.module.scss";

import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";

function BubbelChartFilter() {
  const { valueAll } = useDataContext();
  const [dataList, setDataList] = useState();
  var diameter = 400;

  console.log(valueAll);

  useEffect(() => {
    if (valueAll) {
      var root = d3
        .hierarchy(valueAll)
        .sum(function (d) {
          return d.sizeInMegabytes;
        })
        .sort(function (a, b) {
          return b.sizeInMegabytes - a.sizeInMegabytes;
        });
      const dataBubble = bubble(root);
      setDataList(root.children);
    }
  }, [valueAll]);

  if (valueAll) {
    var colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(valueAll.children, function (d) {
          return d.sizeInMegabytes;
        }),
      ])
      .range(["rgb(233,150,122)", "	rgb(139,0,0)"]);
  }

  var bubble = d3.pack().size([diameter, diameter]).padding(5);

  const handleClick = (value) => {
    console.log(value);

    setValueDate(undefined);

    // TODO: Filtering
    // create new component to show date filtered data
    // filter datamessages on date and get them into the new component
    // make sure to have at least the date and ID for each message in the filtered data
    // create click handler for multiple date ranges

    // TODO: Single emails
    // repeat process for creating a new component for single emails
    // Make sure to get the right data to display
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
          <g className={styles.graph} onClick={() => handleClick(item.data.id)}>
            <circle
              r={item.r}
              style={{ fill: `${colorScale(item.sizeInMegabytes)}` }}
            />
            <text
              dy=".3em"
              style={{ textAnchor: "middle", fill: "rgb(255, 255, 255)" }}
            >
              {item.data.id}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
export default BubbelChartFilter;
