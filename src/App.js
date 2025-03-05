import "./App.css";
import FileUploader from "./Components/FileUploader";
import ScheduleViewer from "./Components/ScheduleViewer";
import TodaySchedule from "./Components/TodaySchedule";

function App() {
  return (
    <div>
      <FileUploader />
      <div style={{ display: "flex" }}>
        <TodaySchedule />
        <ScheduleViewer />
      </div>
    </div>
  );
}

export default App;
