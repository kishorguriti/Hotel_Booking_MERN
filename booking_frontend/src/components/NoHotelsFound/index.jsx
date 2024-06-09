import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const NoHotelsFound = ({ city }) => {
  return (
    <>
      <div className="NoHotelscontainer">
        <div>
          <FontAwesomeIcon icon={faMagnifyingGlass} fontSize={36} />
        </div>

        <h3 className="search_result_title">No properties found</h3>
        <p>
          There are no matching properties for your search criteria. Try
          updating your search.
        </p>
      </div>
    </>
  );
};

export default NoHotelsFound;
