import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import { createTheme, ThemeProvider } from "@mui/material";
import ReactDataGridAdvancedDemo from "./demos/kyotsuDataGrid/ReactDataGridDemo";
import ProjectManagementParent from "./demos/kyotsuDialog/ProjectManagementParent";
import ShozokuCodeSentakuParent from "./demos/shozokuCodeSentaku/shozokuCodeSentakuParent";
import KyotsuTextInputDemo from "./demos/form-comparison/SampleA/KyotsuTextInputDemo";
import KyotsuTextInputDemoB from "./demos/form-comparison/SampleB/KyotsuTextInputDemoB";
import KyotsuTextInputDemoC from "./demos/form-comparison/SampleC/KyotsuTextInputDemoC";
import KyotsuTextInputDemoD from "./demos/form-comparison/SampleD/KyotsuTextInputDemoD";

// 高さの基準となるピクセル数（ここを自由に調整可能）
const SMALL_COMPONENT_HEIGHT = 36; // 高さ
const SMALL_FONT_SIZE = "14px"; // フォントサイズ
const SMALL_PADDING = "6px 10px"; // パディング

const theme = createTheme({
  components: {
    // TextField のカスタマイズ
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.MuiTextField-root": {
            "& .MuiInputBase-sizeSmall": {
              height: `${SMALL_COMPONENT_HEIGHT}px`,
              fontSize: SMALL_FONT_SIZE,
              boxSizing: "border-box",
              "& input": {
                padding: SMALL_PADDING, // 内部のインプットのパディング
              },
            },
          },
        },
      },
    },

    // Select（コンボボックス）のカスタマイズ
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.MuiSelect-select": {
            height: `${SMALL_COMPONENT_HEIGHT - 4}px`, // 少し余白調整
            fontSize: SMALL_FONT_SIZE,
            padding: SMALL_PADDING,
            display: "flex",
            alignItems: "center",
          },
        },
      },
    },

    // Autocomplete のカスタマイズ
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          "&.MuiInputBase-sizeSmall": {
            height: `${SMALL_COMPONENT_HEIGHT}px`,
            fontSize: SMALL_FONT_SIZE,
            padding: SMALL_PADDING,
            boxSizing: "border-box",
          },
        },
      },
    },

    // OutlinedInput のカスタマイズ（SelectやAutocomplete内部で使用）
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.MuiInputBase-sizeSmall": {
            height: `${SMALL_COMPONENT_HEIGHT}px`,
            fontSize: SMALL_FONT_SIZE,
            boxSizing: "border-box",
          },
        },
        input: {
          padding: SMALL_PADDING,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/react-data-grid-advanced"
          element={<ReactDataGridAdvancedDemo />}
        />
        <Route
          path="/project-management"
          element={<ProjectManagementParent />}
        />
        <Route
          path="/shozoku-code-sentaku"
          element={<ShozokuCodeSentakuParent />}
        />
        <Route
          path="/kyotsu-text-input-demo"
          element={<KyotsuTextInputDemo />}
        />
        <Route
          path="/kyotsu-text-input-demo-b"
          element={<KyotsuTextInputDemoB />}
        />
        <Route
          path="/kyotsu-text-input-demo-c"
          element={<KyotsuTextInputDemoC />}
        />
        <Route
          path="/kyotsu-text-input-demo-d"
          element={<KyotsuTextInputDemoD />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
