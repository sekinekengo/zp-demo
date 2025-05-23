// Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Container,
  Divider
} from "@mui/material";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          共通コンポーネントデモ集
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            React Hook Form実装パターン比較
          </Typography>
          <Typography variant="body2" paragraph>
            異なるReact Hook Form実装パターンを比較するデモページです。
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  サンプルA
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  素のReact Hook Form
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/kyotsu-text-input-demo")}
                >
                  デモを見る
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  サンプルB
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  Controller使用パターン
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/kyotsu-text-input-demo-b")}
                >
                  デモを見る
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  サンプルC
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  register + forwardRefパターン
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/kyotsu-text-input-demo-c")}
                >
                  デモを見る
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  サンプルD
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  内蔵Controllerパターン
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/kyotsu-text-input-demo-d")}
                >
                  デモを見る
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          その他のコンポーネントデモ
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                データグリッド
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                高度な機能を持つReact Data Gridのデモ
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/react-data-grid-advanced")}
              >
                デモを見る
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                プロジェクト管理
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                ダイアログを使用したプロジェクト管理デモ
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/project-management")}
              >
                デモを見る
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                所属コード選択
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                コード選択コンポーネントのデモ
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/shozoku-code-sentaku")}
              >
                デモを見る
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
