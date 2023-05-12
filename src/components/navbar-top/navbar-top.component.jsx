import { React, useContext, useState } from "react";

import Dropdown from "../dropdown/dropdown.component";
import ResetButton from "../reset-button/reset-button.component";
import SearchComponent from "../search/search.component.jsx";
import SearchHelpComponent from "../search-help/search-help.component";
import BuildProfiles from "../build-profiles/build-profiles.component";
import ShareButton from "../share-button/share-button.component";
import HomeButton from "../home-button/home-button.component";

import ClassSelectionContext from "../../contexts/class-selection.context";

import "./navbar-top.styles.scss";

const Navbar = ({
  nodes,
  links,
  svg,
  nodeGroup,
  setResetStatus,
  toggleInfo,
  handleSearch,
  treeGroupRef,
  setHighlightedNodes,
}) => {
  const { selectedClass } = useContext(ClassSelectionContext);

  return (
    <div className="navbar">
      <div className="navbar-center"></div>
      <div className="navbar-left-button-container">
        <HomeButton />
      </div>
      <div className="navbar-center-button-container">
        <Dropdown />
        <ResetButton
          nodes={nodes}
          links={links}
          svg={svg}
          nodeGroup={nodeGroup}
          setResetStatus={setResetStatus}
        />
      </div>
      <div className="navbar-right-button-container">
        <BuildProfiles />
        <ShareButton />
        <button className="d4-button class-info-button" onClick={toggleInfo}>
          Class Details
        </button>
        <SearchComponent
          onSearch={handleSearch(nodes, treeGroupRef, setHighlightedNodes)}
        />
        <SearchHelpComponent />
      </div>
    </div>
  );
};

export default Navbar;
