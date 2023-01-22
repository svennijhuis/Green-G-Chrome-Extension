import * as d3 from "d3";
import styles from "./Chart.module.scss";

import throttle from "lodash/throttle";

import { useDataContext } from "../../context/data";
import { useEffect, useState, useCallback } from "react";

function BubbelChartFilter() {
  const { valueAll, deleteMessagesId, setDeleteMessagesId, valueDate } =
    useDataContext();
  const [dataList, setDataList] = useState();
  const [stroke, setStroke] = useState();
  const [snippet, setSnippet] = useState();
  const [from, setFrom] = useState();

  const [enter, setEnter] = useState();

  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [divStyle, setDivStyle] = useState({
    opacity: 0,
    visibility: "hidden",
  });

  var diameter = 460;

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

  // if (valueAll) {
  //   var colorScale = d3
  //     .scaleLinear()
  //     .domain([
  //       0,
  //       d3.max(valueAll.children, function (d) {
  //         return d.sizeInMegabytes;
  //       }),
  //     ])
  //     .range(["rgb(71, 187, 94)", "rgb(46, 73, 123)"]);
  // }

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

  // const addMetaData = (e, snippet, from) => {
  //   setSnippet(snippet);
  //   setFrom(from);

  //   const x = e.clientX;
  //   console.log(e.clientX);
  //   const y = e.clientY;
  //   setLocation({ x, y });
  //   setDivStyle({
  //     left: `${x}px`,
  //     top: `${y}px`,
  //   });
  // };
  const addMetaData = useCallback(
    throttle((e, snippet, from) => {
      setSnippet(snippet);
      setFrom(from);

      setEnter(true);

      const x = e.clientX;
      console.log(e.clientX);
      const y = e.clientY;
      setLocation({ x, y });
      if (e.clientX > 275) {
        setDivStyle({
          left: `${x - 250}px`,
          top: `${y + 10}px`,
        });
      } else {
        setDivStyle({
          left: `${x}px`,
          top: `${y + 10}px`,
          opacity: 1,
          visibility: "visible",
        });
      }
    }, 100),
    []
  );

  const handleHoverOff = () => {
    setEnter(false);
    setDivStyle({
      // left: `${x}px`,
      // top: `${y + 10}px`,
      opacity: 0,
      visibility: "hidden",
    });
  };

  console.log(location);

  if (!dataList) {
    return <p>No items to display</p>;
  }

  return (
    <>
      <svg className="chart-svg" width={diameter} height={diameter}>
        {dataList.map((item, index) => (
          <g
            className={styles.node}
            key={index}
            transform={`translate(${item.x + " " + item.y})`}
          >
            <g
              className={styles.graph}
              onClick={() => handleClick(item.data.id)}
              onMouseOver={(e) =>
                addMetaData(e, item.data.snippet, item.data.from[0][1])
              }
            >
              <circle
                onMouseLeave={handleHoverOff}
                r={item.r}
                stroke={
                  stroke.includes(item.data.id)
                    ? "rgb(46, 73, 123)"
                    : "#363f8ab3"
                }
                strokeWidth="3"
                fill={
                  stroke.includes(item.data.id)
                    ? "rgb(46, 73, 123)"
                    : "#363f8ab3"
                }
              />
            </g>
          </g>
        ))}
      </svg>
      <div
        style={divStyle}
        className="flex flex-col bg-black p-2 w-[275px] rounded-lg border-black border-2 absolute transition-opacity"
      >
        <h2 className="text-18 mb-1 text-white font-bold">{from}</h2>
        <p className="text-15  text-white font-medium pb-1">{snippet}</p>
      </div>
    </>
  );
}
export default BubbelChartFilter;
