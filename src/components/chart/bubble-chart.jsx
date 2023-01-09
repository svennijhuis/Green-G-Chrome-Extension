import * as d3 from "d3";
import { svg } from "d3";
import { useState, useEffect, useRef } from "react";

const forceStrength = 0.03;

// const width = 940;
// const height = 600;
// const center = { x: width / 2, y: height / 2 };

const colorFn = d3.scaleLinear().domain([7, 15]).range(["#d84b2a", "#7aa25c"]);

function startSimulation(bubbles, updateState, width, height) {
  const center = { x: width / 2, y: height / 2 };

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  const simulation = d3
    .forceSimulation()
    .velocityDecay(0.2)
    .force("x", d3.forceX().strength(forceStrength).x(center.x))
    .force("y", d3.forceY().strength(forceStrength).y(center.y))
    .force("charge", d3.forceManyBody().strength(charge))
    .on("tick", () => updateState(bubbles))
    .stop();

  simulation.nodes(bubbles);
  simulation.alpha(1).restart();
}

function formatBubbleData(rawData, width, height) {
  const maxValue = d3.max(rawData, function (d) {
    return +d.value;
  });

  const radiusScale = d3.scalePow().exponent(0.5).range([2, 85]).domain([0, maxValue]);

  const myBubbles = rawData.map((d) => ({
    name: d.name,
    value: d.value,
    radius: radiusScale(d.value),
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  // sort them to prevent occlusion of smaller nodes.
  myBubbles.sort(function (a, b) {
    return b.value - a.value;
  });

  return myBubbles;
}

function BubbleChart({ data }) {
  // useRef is react, hook which allows me to get a reference to the svg html element
  const ref = useRef();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // if the svg element exists, then start the simulation
    if (ref.current) {
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;
      // needs the real width and height
      startSimulation(
        formatBubbleData(data, width, height),
        (bubbles) => {
          setBubbles(() => [...bubbles]);
        },
        // startSimulation also needs width and heigth parameter to calculate the center
        width,
        height
      );
    }
  }, [data]);

  return (
    // left ref is the html attribute, right ref is the variable of line 56, which connect each other
    <svg
      ref={ref}
      width="100%"
      height="100%"
      // correct viewbox according to ratio, used for size: https://whatismyviewport.com/
      viewBox="0 0 1920 937"
      preserveAspectRatio="xMinYMin meet"
    >
      {bubbles.map((bubble) => {
        return (
          <circle
            key={bubble.name}
            r={bubble.radius}
            fill={colorFn(bubble.value)}
            stroke={d3.rgb(colorFn(bubble.value)).darker()}
            strokeWidth={2}
            cx={bubble.x}
            cy={bubble.y}
          >
            <title>{bubble.name}</title>
          </circle>
        );
      })}
    </svg>
  );
}
export default BubbleChart;
