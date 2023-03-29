import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";

import "./skill-tree.styles.scss";

// Images
import nodeHubImage from "../../assets/node_diamond_inactive_large.png";
import activeSkillImage from "../../assets/node_square_inactive_large.png";
import activeSkillBuffImage from "../../assets/node-square-angled-large.png";
import passiveSkillImage from "../../assets/node-square-circle-large.png";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = ({
  skillData,
  allocatedPoints,
  activeSkills,
  onSkillClick,
  onSkillActivation,
}) => {
  const treeContainerRef = useRef(null);
  const treeGroupRef = useRef(null);
  const skillTreeData = sorcererData;

  const [totalAllocatedPoints, setTotalAllocatedPoints] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!skillTreeData) return;

    const containerWidth = treeContainerRef.current.clientWidth;
    const containerHeight = treeContainerRef.current.clientHeight;
    const initialTransform = d3.zoomIdentity.translate(
      containerWidth / 2,
      containerHeight / 2
    );

    const svg = d3.select(treeContainerRef.current);
    svg.selectAll("*").remove();

    // Helper function to flatten the structure
    const flatten = (data) => {
      const nodes = [];
      const links = [];

      function traverse(node) {
        // nodes.push(node);
        nodes.push({ ...node, allocatedPoints: node.allocatedPoints || 0 });

        if (node.children) {
          node.children.forEach((child) => {
            links.push({ source: node, target: child });
            traverse(child);
          });
        }
      }

      traverse(data);

      return { nodes, links };
    };

    // Extract nodes and links directly from the skillTreeData object
    const { nodes, links } = flatten(skillTreeData);

    // Define the zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 2])
      .on("zoom", (event) => {
        containerGroup.attr("transform", event.transform);
      });

    // Add the zoom behavior to the svg
    svg.call(zoom);

    // Create a container group element
    const containerGroup = svg.append("g").attr("class", "svg-container");
    // Fix the first zoom & drag incorrect behavior with applying the initial transform values
    svg.call(zoom.transform, initialTransform);

    // Get the link types based on the source and target node type
    const getLinkType = (source, target) => {
      if (source.nodeType === "nodeHub" && target.nodeType === "nodeHub") {
        return "hubLink";
      }
      return "nodeLink";
    };

    // Create custom link properties based on link type
    const getLinkAttributes = (source, target) => {
      const linkType = getLinkType(source, target);

      if (linkType === "hubLink") {
        return {
          class: "hub-link",
          //fill: "url(#hubPattern)", // Reference to the pattern you want to use
          //strokeColor: "url(#hubPattern)", // Reference to the pattern you want to use
          linkFill: "#2a3031",
          linkWidth: 60,
          linkHeight: 60,
        };
      } else {
        return {
          class: "node-link",
          //fill: "url(#nodePattern)", // Reference to the pattern you want to use
          //strokeColor: "url(#nodePattern)", // Reference to the pattern you want to use
          //linkFill: "url(#nodePattern)",
          linkFill: "#2a3031",
          linkWidth: 20,
          linkHeight: 60,
        };
      }
    };

    // Custom link draw function
    // const drawLink = (sourceX, sourceY, targetX, targetY) => {
    //   const deltaX = targetX - sourceX;
    //   const deltaY = targetY - sourceY;
    //   const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    //   const steps = Math.floor(distance / 30);
    //   const stepSize = distance / steps;

    //   let d = `M${sourceX},${sourceY}`;

    //   for (let i = 1; i <= steps; i++) {
    //     const x = sourceX + deltaX * (i / steps);
    //     const y = sourceY + deltaY * (i / steps);
    //     const yOffset = i % 1 === 0 ? 10 : -10;
    //     d += `L${x},${y + yOffset}`;
    //   }

    //   d += `L${targetX},${targetY}`;

    //   return d;
    // };

    const calculateAngle = (source, target) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      return Math.atan2(dy, dx);
    };

    const calculateDistance = (source, target) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Draw links
    containerGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", (d) => getLinkAttributes(d.source, d.target).class)
      .attr("d", (d) => {
        // console.log("d: " + d.text);
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        // var xcontrol = targetX / 2 + sourceX / 2;
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        // return `M${sourceX},${sourceY}L${targetX},${targetY}Z`;
        // return [
        //   "M",
        //   sourceX,
        //   sourceY,
        //   "L",
        //   xcontrol,
        //   sourceY,
        //   xcontrol,
        //   targetY,
        //   targetX,
        //   targetY,
        // ].join(" ");
        // return drawLink(sourceX, sourceY, targetX, targetY);
      })
      // .attr("stroke", "white")
      .attr("stroke", (d) => getLinkAttributes(d.source, d.target).linkFill)
      // .attr("stroke", (d) => "url(#hubPattern)")
      // .attr("fill", (d) => getLinkAttributes(d.source, d.target).linkFill)
      // .attr("fill", "#e60000")
      .attr(
        "stroke-width",
        (d) => getLinkAttributes(d.source, d.target).linkWidth
      )
      //.attr("stroke-dasharray", "50 50") // Modify these numbers according to your desired pattern repetition
      //.attr("stroke-dashoffset", 0); // Modify this number to control the starting position of the pattern;
      .attr("fill", "none");

    // Draw links
    // containerGroup
    //   .selectAll("rect")
    //   .data(links)
    //   .enter()
    //   .append("rect")
    //   .attr("class", (d) => getLinkAttributes(d.source, d.target).class)
    //   .attr("width", (d) => getLinkAttributes(d.source, d.target).linkWidth)
    //   .attr("height", (d) => calculateDistance(d.source, d.target))
    //   // .attr("rotate", (d) => )
    //   .attr("x", (d) => d.source.x)
    //   .attr("y", (d) => d.source.y)
    //   .attr("fill", (d) => getLinkAttributes(d.source, d.target).linkFill)
    //   .attr("transform", (d) => {
    //     const angle = (calculateAngle(d.source, d.target) * 380) / Math.PI;
    //     return `rotate(${angle}, ${d.source.x}, ${d.source.y})`;
    //   });

    // Create custom node attributes based on nodeType
    const getNodeAttributes = (nodeType) => {
      switch (nodeType) {
        case "nodeHub":
          return {
            class: "node-hub",
            image: nodeHubImage,
            width: 250,
            height: 250,
            translateX: -125,
            translateY: -125,
          };
        case "activeSkill":
          return {
            class: "active-skill-node",
            image: activeSkillImage,
            width: 220,
            height: 220,
            translateX: -110,
            translateY: -110,
          };
        case "activeSkillBuff":
          return {
            class: "active-skill-buff-node",
            image: activeSkillBuffImage,
            width: 120,
            height: 120,
            translateX: -60,
            translateY: -60,
          };
        case "passiveSkill":
          return {
            class: "passive-skill-node",
            image: passiveSkillImage,
            width: 150,
            height: 150,
            translateX: -75,
            translateY: -75,
          };
        default:
          return {
            class: "node",
            image: "need-default-image-here",
            width: 50,
            height: 50,
            translateX: -25,
            translateY: -25,
          };
      }
    };

    // Draw nodes
    const nodeGroup = containerGroup
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", (d) => getNodeAttributes(d.nodeType).class)
      // Set individual node positions on the canvas
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      // Set the default placement of the tree and zoom level at firstl load
      .call(zoom.transform, initialTransform);

    // basic circle for debugging only
    //nodeGroup.append("circle").attr("r", 10).attr("fill", "grey");

    // Apply the images to the nodes
    nodeGroup
      .append("image")
      .attr("class", "skill-node-image")
      .attr("href", (d) => getNodeAttributes(d.nodeType).image)
      .attr("width", (d) => getNodeAttributes(d.nodeType).width)
      .attr("height", (d) => getNodeAttributes(d.nodeType).height)
      .attr("transform", (d) => {
        const { translateX, translateY } = getNodeAttributes(d.nodeType);
        return `translate(${translateX}, ${translateY})`;
      });

    // Add the skill name text to the nodes
    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      // .attr("y", (d) => getNodeImageAttributes(d.nodeType).height + 1)
      .attr("dy", "2.5rem")
      .attr("class", "node-text")
      .text((d) => d.name);

    // ===================================== NODE BEHAVIOR/FUNCTIONALITY

    // Add the points indicator to the nodes
    nodeGroup
      .append("text")
      .attr("class", "point-indicator")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5rem")
      // .attr("x", (d) => getNodeImageAttributes(d.nodeType).width - 160)
      .attr("y", (d) => getNodeAttributes(d.nodeType).height / 4 - 10)
      .text((d) =>
        d.nodeType !== "nodeHub" ? `${d.allocatedPoints}/${d.maxPoints}` : ""
      );

    // Update the point indicator on click
    nodeGroup.on("click", (event, d) => {
      handleNodeClick(d);
      d3.select(event.currentTarget)
        .select(".point-indicator")
        .text(`${d.allocatedPoints}/${d.maxPoints}`);
    });

    const isNodeActive = (node) => {
      if (node.requiredPoints === undefined) {
        return true;
      }
      return totalAllocatedPoints >= node.requiredPoints;
    };

    nodeGroup
      .append("image")
      .attr("class", (d) => (isNodeActive(d) ? "active-node" : ""))
      .attr("opacity", (d) => (isNodeActive(d) ? 1 : 0.3));

    // Check if a node is clikcable(active)
    const isNodeClickable = (node) => {
      if (node.nodeType === "nodeHub") {
        return false;
      }

      if (node.connections && node.connections.length > 0) {
        const parentNode = nodes.find((n) => node.connections.includes(n.name));
        return parentNode && parentNode.allocatedPoints >= 1;
      }

      return true;
    };

    // Handle the clikc on a node (point allocation)
    const handleNodeClick = (node) => {
      console.log("node's max points: " + node.maxPoints);
      console.log("node's allocated points: " + node.allocatedPoints);
      if (!isNodeClickable(node)) {
        return;
      }

      if (node.allocatedPoints < node.maxPoints) {
        node.allocatedPoints += 1;
        setTotalAllocatedPoints(totalAllocatedPoints + 1);
      }

      nodeGroup
        .filter((d) => d.id === node.id)
        .attr("stroke", (d) => (d.allocatedPoints > 0 ? "white" : "none"))
        .attr("stroke-width", (d) => (d.allocatedPoints > 0 ? 2 : 0));
    };

    // console.log("===== " + nodeGroup.attr);
  }, [skillTreeData]);

  return (
    <div className="skill-tree" style={containerStyles}>
      <svg ref={treeContainerRef} width="100%" height="100%">
        {/* Custom style for the links */}
        {/* <defs>
          <pattern
            id="nodePattern"
            patternUnits="userSpaceOnUse"
            width="30"
            height="30"
            patternTransform="rotate(45)"
          >
            <rect width="30" height="30" fill="#3b4343" />
          </pattern>
        </defs> */}
        {/* <defs>
          <pattern
            id="hubPattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="rotate(45)"
          >
            <path d="M0,0 L50,0 L25,50z" fill="url(#customGradient)" />
            <path d="M0,0 L50,0 L25,50z" fill="#ee3800" />
            <image href="./../assets/circle-oval.svg" width="20" height="20" />
          </pattern>
          <pattern
            id="nodePattern"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
            patternTransform="rotate(45)"
          >
            <path d="M0,0 L50,0 L25,50z" fill="#ee3800" />
            <image href="path/to/your/image.svg" width="100" height="100" />
          </pattern>
        </defs> */}
        <g ref={treeGroupRef}></g>
      </svg>
    </div>
  );
};

export default SkillTreeComponent;
