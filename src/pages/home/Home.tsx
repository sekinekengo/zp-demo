// Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>ホーム画面</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={() => navigate("/react-data-grid-advanced")}>
          React Data Grid 高度な機能デモへ
        </button>
        <button onClick={() => navigate("/project-management")}>
          プロジェクト管理デモへ
        </button>
      </div>
    </div>
  );
};

export default Home;
