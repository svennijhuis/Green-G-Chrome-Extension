import * as d3 from "d3";
import styles from "./Chart.module.scss";

var json = {
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

var diameter = 350;
// color = d3.scaleOrdinal(d3.schemeCategory20c);

var colorScale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(json.children, function (d) {
      return d.value;
    }),
  ])
  .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

var bubble = d3.pack().size([diameter, diameter]).padding(5);

var margin = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

var root = d3
  .hierarchy(json)
  .sum(function (d) {
    return d.value;
  })
  .sort(function (a, b) {
    return b.value - a.value;
  });

const dataBubble = bubble(root);

const myBubbles = root.children.map((d) => ({
  name: d.data.name,
  value: d.value,
  r: d.r,
  x: d.x,
  y: d.y,
}));

console.log(root.children);
console.log(myBubbles);

function BubbleChart() {
  return (
    <svg
      className="chart-svg"
      width={diameter + margin.right}
      height={diameter}
    >
      {myBubbles.map((item, index) => (
        <g
          className={styles.node}
          key={index}
          transform={`translate(${item.x + " " + item.y})`}
        >
          <g className={styles.graph}>
            <circle r={item.r} />
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
