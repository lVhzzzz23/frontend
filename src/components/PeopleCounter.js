import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PeopleCounter = () => {
  const webcamRef1 = useRef(null);
  const webcamRef2 = useRef(null);
  const [model, setModel] = useState(null);
  const [peopleIn, setPeopleIn] = useState(0);
  const [peopleOut, setPeopleOut] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Người vào",
        data: [],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Người ra",
        data: [],
        borderColor: "#F44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        borderWidth: 2,
      },
    ],
  });

  const trackedPeople = useRef(new Set());

  // Fetch API to get data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-count");
        const data = await response.json();
        setPeopleIn(data.peopleIn);
        setPeopleOut(data.peopleOut);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const fetchInterval = setInterval(fetchData, 5000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Load the model
  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      detect(webcamRef1, setPeopleIn, true);
      detect(webcamRef2, setPeopleOut, false);
    }, 1000);

    const chartUpdateInterval = setInterval(() => {
      updateChartData();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(chartUpdateInterval);
    };
  }, [model]);

  const detect = async (webcamRef, updateCount, isEntering) => {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);

      const peopleDetected = predictions.filter(
        (prediction) => prediction.class === "person"
      );

      const boundary = video.offsetHeight / 2;

      peopleDetected.forEach((person) => {
        const centerY = person.bbox[1] + person.bbox[3] / 2;

        if (isEntering && centerY > boundary) {
          if (!trackedPeople.current.has(person.bbox.toString())) {
            trackedPeople.current.add(person.bbox.toString());
            updateCount((prevCount) => prevCount + 1);
          }
        } else if (!isEntering && centerY < boundary) {
          if (!trackedPeople.current.has(person.bbox.toString())) {
            trackedPeople.current.add(person.bbox.toString());
            updateCount((prevCount) => prevCount + 1);
          }
        }
      });
    }
  };

  const updateChartData = () => {
    const currentTime = new Date().toLocaleTimeString();

    setChartData((prevData) => {
      const updatedLabels = [...prevData.labels, currentTime];
      const updatedPeopleIn = [...prevData.datasets[0].data, peopleIn];
      const updatedPeopleOut = [...prevData.datasets[1].data, peopleOut];

      return {
        ...prevData,
        labels: updatedLabels.slice(-10),
        datasets: [
          { ...prevData.datasets[0], data: updatedPeopleIn.slice(-10) },
          { ...prevData.datasets[1], data: updatedPeopleOut.slice(-10) },
        ],
      };
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Chủ phòng</h1>
      </header>
      <div style={styles.content}>
        <div style={styles.cameraSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Camera 1 (Người vào)</h2>
            <Webcam audio={false} ref={webcamRef1} style={styles.webcam} />
            <h3 style={{ ...styles.counter, color: "#4CAF50" }}>
              {peopleIn} người vào
            </h3>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Camera 2 (Người ra)</h2>
            <Webcam audio={false} ref={webcamRef2} style={styles.webcam} />
            <h3 style={{ ...styles.counter, color: "#F44336" }}>
              {peopleOut} người ra
            </h3>
          </div>
        </div>
        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>Thống kê</h2>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#2196F3",
    color: "#fff",
    width: "100%",
    padding: "15px",
    textAlign: "center",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    width: "100%",
  },
  cameraSection: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center",
    width: "45%",
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "18px",
    color: "#333",
  },
  webcam: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  counter: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "90%",
  },
  chartTitle: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
    color: "#333",
  },
};

export default PeopleCounter;
