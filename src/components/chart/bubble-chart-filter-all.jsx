import * as d3 from "d3";
import styles from "./Chart.module.scss";

import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";

function BubbelChartFilter() {
  const { valueAll, deleteMessagesId, setDeleteMessagesId } = useDataContext();
  const [dataList, setDataList] = useState();
  const [stroke, setStroke] = useState();
  const [stateColor, useStateColor] = useState();
  var diameter = 550;

  console.log("delarrayid", deleteMessagesId);

  console.log(valueAll);

  useEffect(() => {
    if (valueAll) {
      const newArray = [];
      valueAll.children.forEach((item) => {
        newArray.push(item.id);
      });
      setDeleteMessagesId(newArray);

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

  useEffect(() => {
    setStroke(deleteMessagesId);
  }, []);

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  // const handleClick = (value) => {
  //   if (stroke.includes(value)) {
  //     const test = arrayRemove(stroke, value);
  //     setStroke(test);
  //   } else {
  //     console.log(value);
  //     const test = stroke.push(value);
  //     setStroke(test);
  //   }
  // };

  const handleClick = (id) => {
    if (deleteMessagesId.includes(id)) {
      setStroke(deleteMessagesId.filter((i) => i !== id));
      setDeleteMessagesId(deleteMessagesId.filter((i) => i !== id));
    } else {
      setStroke([...stroke, id]);
      setDeleteMessagesId([...deleteMessagesId, id]);
    }
  };

  console.log(stroke);

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
              stroke={stroke.includes(item.data.id) ? "Red" : "Black"}
              strokeWidth="3"
              style={{
                fill: `${colorScale(item.sizeInMegabytes)}`,
              }}
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
