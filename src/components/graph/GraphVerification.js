import React, { useState } from "react";

const GraphVerification = () => {
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState();
  const [isRedBlueColorable, setIsRedBlueColorable] = useState();

  const handleOnTextChange = (event) => setText(event.target.value);

  const onClickHandler = () => {
    const graph = createGraph(); // create graph from the input value

    setIsConnected(findIsGraphConnected(graph)); //check if the graph is connected
    setIsRedBlueColorable(findIfGraphIsRedBlueColorable(graph)); // check if the graph is colorable with min of 2 colors
  };
  const createGraph = () => {
    let graph = {}; // object to store graph nodes and Edges {[node] : [...its connections]}
    // iterate through the input value
    for (let index = 0; index < text.length; index++) {
      const element = text[index];
      // if it's a letter => node
      if (element >= "A" && element <= "z") {
        // if !exist add it as a node to the graph {[node]:[]}
        if (!graph[element]) {
          graph[element] = [];
        }
      } // if it's a dash => edge create the link
      else if (element === "-") {
        // take both nodes a-b => "a" and "b"
        const node1 = text[index - 1]; //first node
        const node2 = text[index + 1]; // scd node
        // check if they are nodes => letters
        if (node1 >= "A" && node1 <= "z" && node2 >= "A" && node2 <= "z") {
          graph = {
            ...graph,
            // put node2 as connection to node1
            [node1]: [...(graph[node1] ? graph[node1] : []), node2],
            // put node1 as connection to node2
            [node2]: [...(graph[node2] ? graph[node2] : []), node1],
          };
        }
      }
    }
    return graph;
  };
  const findIsGraphConnected = (graph) => {
    // create an object to know if a node has been visited or not
    let visitedNodes = {};
    Object.keys(graph).forEach((element) => {
      visitedNodes[element] = false;
    });
    // containes the list of nodes to be developed
    let nodes = [Object.keys(graph)[0]];
    // start parcours
    while (nodes.length) {
      // get the current node that we are goind to visit
      const currentNode = nodes.pop();
      //if its still not visited
      if (!visitedNodes[currentNode]) {
        //set it as visited
        visitedNodes[currentNode] = true;
        //iterate through all of its connections
        graph[currentNode].forEach((el) => {
          //if the connection is still not visited
          if (!visitedNodes[el]) {
            // put in list of nodes to be visited to visit as a child of current node
            nodes.push(el);
          }
        });
      }
    }
    // check if all nodes are visited or not
    const isAllNodeVisited = Object.entries(visitedNodes).findIndex(
      // look for node wich still invisited
      ([_, values]) => !values
    );
    // all nodes are visited return true else false
    return isAllNodeVisited === -1 ? true : false;
  };

  const findIfGraphIsRedBlueColorable = (graph) => {
    // sort all nodes based on their degree
    const graphNodes = Object.entries(graph)
      .sort(([key1, value1], [key2, value2]) => value2.length - value1.length)
      .map(([key, _]) => key);
    // table to store the nodes that has been colored
    let coloredNodes = [];
    // the color to be used
    let numberOfColors = 0;
    //iterate through graph nodes
    for (let index = 0; index < graphNodes.length; index++) {
      // if the node is already colored go to next
      if (coloredNodes.includes(graphNodes[index])) {
        continue;
      } else {
        // node is not colored yet
        numberOfColors = numberOfColors + 1;
        // color it
        coloredNodes.push(graphNodes[index]);
        // for all the rest of the nodes
        for (let j = index + 1; j < graphNodes.length; j++) {
          const element = graphNodes[j];
          // if the node is not a connection of the colored node
          if (!graph[graphNodes[index]].includes(element)) {
            // color it with the same color
            coloredNodes.push(graphNodes[j]);
          }
        }
      }
    }
    return numberOfColors <= 2 ? true : false;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          style={{
            border: "1px solid #DADADA",
            borderRadius: "3px",
            height: "36px",
            width: "400px",
            marginRight: "20px",
          }}
          placeholder="Eg. a-b, b-c, a-c"
          id="app-input"
          data-testid="app-input"
          value={text}
          onChange={handleOnTextChange}
        />
        <button
          id="submit-button"
          data-testid="submit-button"
          style={{
            height: "37px",
            padding: "10px 20px",
            border: "1px solid #000",
            borderRadius: "3px",
            backgroundColor: "#FFFFFF",
          }}
          onClick={onClickHandler}
        >
          Check
        </button>
      </div>
      <div>
        {isConnected !== undefined &&
          (isConnected ? (
            <p>the graph is connected</p>
          ) : (
            <p>the graph is not connected</p>
          ))}
        {isRedBlueColorable !== undefined &&
          isConnected &&
          (isRedBlueColorable ? (
            <p>the graph is red blue colorable</p>
          ) : (
            <p>the graph is not red blue colorable</p>
          ))}
      </div>
    </div>
  );
};

export default GraphVerification;
