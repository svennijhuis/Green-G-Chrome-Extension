import * as d3 from "d3";
import styles from "./Chart.module.scss";

import throttle from "lodash/throttle";

import { useDataContext } from "../../context/data";
import { useEffect, useState, useCallback, useRef } from "react";

function BubbleChart() {
  const {
    dataMessages,
    dataMessagesList,
    setDataMessagesList,
    countedSenders,
    setValueFilter,
  } = useDataContext();

  const [dataList, setDataList] = useState();
  const [count, setCount] = useState();
  const [name, setName] = useState();

  const [enter, setEnter] = useState();

  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [divStyle, setDivStyle] = useState({
    opacity: 0,
    visibility: "hidden",
  });
  const [textWidths, setTextWidths] = useState([]);
  const textRefs = useRef([]);
  var diameter = 420;

  useEffect(() => {
    const chartData = { children: countedSenders };

    var root = d3
      .hierarchy(chartData)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    const dataBubble = bubble(root);

    setDataList(root.children);
  }, [countedSenders]);

  if (countedSenders) {
    var colorScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(countedSenders, function (d) {
          return d.value;
        }),
      ])
      .range(["rgb(71, 187, 94)", "rgb(46, 73, 123)"]);
  }

  var bubble = d3.pack().size([diameter, diameter]).padding(5);

  const handleClick = (value) => {
    setValueFilter(value);
  };

  useEffect(() => {
    setTextWidths(
      textRefs.current.map((textRef) => (textRef ? textRef.getBBox().width : 0))
    );
  }, [dataList, textRefs]);

  const addMetaData = useCallback(
    throttle((e, count, name) => {
      setCount(count);
      setName(name);

      setEnter(true);

      const x = e.clientX;
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
              onClick={() => handleClick(item.data.name)}
              onMouseOver={(e) =>
                addMetaData(e, item.data.value, item.data.name)
              }
            >
              <circle
                onMouseLeave={handleHoverOff}
                r={item.r}
                style={{ fill: `${colorScale(item.value)}` }}
              />
              <text
                className={`w-min ${
                  item.r * 2 <= textWidths[index] ? " hidden" : ""
                }`}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                dy=".3em"
                style={{
                  textAnchor: "middle",
                  fill: "rgb(255, 255, 255)",
                }}
              >
                {item.data.name}
              </text>
            </g>
          </g>
        ))}
      </svg>
      <div
        onMouseOver={handleHoverOff}
        style={divStyle}
        className="flex flex-col bg-black p-2 w-[250px] rounded-lg z-[101] border-white border-2 absolute transition"
      >
        <h2 className="text-20 mb-1 text-white font-bold">{name}</h2>
        <p className="text-18  text-white font-medium pb-1">
          Aantal mails: {count}
        </p>
      </div>
    </>
  );
}
export default BubbleChart;
