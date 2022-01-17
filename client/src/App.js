import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import VideoPage from "./VideoPage";
import TaskPage from "./TaskPage";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<TaskPage></TaskPage>} />
          <Route path="/video" element={<VideoPage></VideoPage>} />
        </Routes>
      </Router>
    );
  }
}
