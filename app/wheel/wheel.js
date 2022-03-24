const createSvg = (circles, sections) => {
  let circles_list = [];
  let i;
  for (i = 0; i < circles; i++)
    circles_list.push({
      r: 40 + i * 30,
      style: { fill: "none", stroke: "black" },
    });
  const radius = circles * 30 + 70;
  const angle = (Math.PI * 2) / sections;
  let points = "";
  let lines_list = [];
  for (i = 0; i < sections; i++) {
    const x = radius * Math.sin(angle * i);
    const y = radius * -Math.cos(angle * i);
    lines_list.push({
      x1: 0,
      y1: 0,
      x2: x,
      y2: y,
      style: { stroke: "black" },
    });
    points += ` ${x},${y}`;
  }
  //   const onPolygonClick = () => {
  //     const x = d3.event.layerX - width / 2;
  //     const y = d3.event.layerY - height / 2;

  //     const radius = Math.hypot(x, y);
  //     const circle = Math.abs(Math.ceil((radius - 40) / 30));
  //     let clickAngle = Math.atan2(x, -y);
  //     if (clickAngle < 0) clickAngle = Math.PI * 2 + clickAngle;
  //     const sector = Math.floor(clickAngle / angle);
  //     alert(`Clicked on Circle ${circle} / Sector ${sector}`);
  //   };

  const polygon = {
    points,
    style: {
      fill: "white",
      stroke: "black",
      fill_opacity: 0.01,
      cursor: "pointer",
    },
  };
  // .on("click", onPolygonClick);
  return {
    polygon,
    circles: circles_list,
    lines: lines_list,
  };
};

const createWheel = (circles, sections) => {
  const width = 700;
  const height = 700;
  return {
    width,
    height,
    transform: `translate(${width / 2},${height / 2})`,
    svg: createSvg(circles, sections),
  };
};

const onClickButton = () => {
  const circles = d3.select("#circles").node().value;
  const sections = d3.select("#sections").node().value;
  createSvg(circles, sections);
};

export default { createWheel };
