import { useState } from "react";

interface Point {
  id: number;
  x: number;
  y: number;
  color: string;
}

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("red"); // 기본 색상
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // 배경 이미지

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newPoint: Point = {
      id: points.length + 1,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: selectedColor,
    };
    setPoints((prevPoints) => sortPoints([...prevPoints, newPoint]));
  };

  const handleRemovePoint = (id: number) => {
    setPoints(
      (prevPoints) =>
        prevPoints
          .filter((point) => point.id !== id) // 해당 id 제거
          .map((point, index) => ({ ...point, id: index + 1 })) // id 재정렬
    );
  };

  const handleClearAll = () => {
    setPoints([]);
  };

  const sortPoints = (points: Point[]) => {
    if (points.length < 2) return points;

    // 기준점 찾기 (y가 가장 작고, 동일하면 x가 가장 작은 점)
    const basePoint = points.reduce((min, point) =>
      point.y < min.y || (point.y === min.y && point.x < min.x) ? point : min
    );

    // 각도 계산 후 정렬
    return points.slice().sort((a, b) => {
      if (a === basePoint) return -1;
      if (b === basePoint) return 1;

      const angleA = Math.atan2(a.y - basePoint.y, a.x - basePoint.x);
      const angleB = Math.atan2(b.y - basePoint.y, b.x - basePoint.x);

      return angleB - angleA; // 반시계 방향으로 정렬
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage(null);
    setPoints([]);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "1280px",
          height: "720px",
          border: "1px solid black",
          position: "relative",
          margin: "20px auto",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {points.map((point) => (
          <div
            key={point.id}
            onClick={(e) => {
              e.stopPropagation(); // 부모 div 클릭 이벤트 방지
              handleRemovePoint(point.id);
            }}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: point.color,
              borderRadius: "50%",
              top: point.y - 5,
              left: point.x - 5,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-20px",
                left: "15px",
                backgroundColor: "white",
                padding: "2px 4px",
                border: "1px solid black",
                borderRadius: "3px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {point.id}
            </span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label>
            Select Color:{" "}
            <select value={selectedColor} onChange={handleColorChange}>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="purple">Purple</option>
            </select>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ marginLeft: "10px" }}
          />
          {backgroundImage && (
            <button
              onClick={handleRemoveImage}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Remove Image
            </button>
          )}
        </div>
        <h3>Points</h3>
        <ul>
          {points.map((point) => (
            <div key={point.id}>
              ID: {point.id}&nbsp; Position: ({point.x.toFixed(2)},{" "}
              {point.y.toFixed(2)}){" "}
              <button onClick={() => handleRemovePoint(point.id)}>x</button>
            </div>
          ))}
        </ul>
        {points.length > 0 && (
          <button onClick={handleClearAll}>Clear All</button>
        )}
      </div>
    </div>
  );
}

export default App;
