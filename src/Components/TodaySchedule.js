import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const TodaySchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();
  today.setHours(today.getHours() + 8);
  const formattedDate = today.toISOString().split("T")[0];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const docRef = doc(db, "daily_schedules", formattedDate);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSchedule(docSnap.data());
        } else {
          setSchedule(null);
          setError("No data available for today.");
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error("Firestore Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [formattedDate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Schedule for Today: {formattedDate}</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {schedule && (
        <div>
          <h2>{schedule.bibleVerse || "No Bible Verse Available"}</h2>

          {schedule.ytLink ? (
            <iframe
              width="560"
              height="315"
              src={schedule.ytLink.replace("watch?v=", "embed/")}
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No YouTube Video Available</p>
          )}

          <br />

          {schedule.videoURL ? (
            <video width="560" height="315" controls>
              <source src={schedule.videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No Uploaded Video Available</p>
          )}

          <div>
            {schedule.videoURL && (
              <a
                href={schedule.videoURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={{ marginTop: "10px", padding: "8px 16px" }}>
                  Watch Video
                </button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;
