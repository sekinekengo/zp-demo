import React, { useState } from 'react';
import {
    Box, Button,
    Typography, Paper, Container, List, ListItem,
    ListItemText
} from '@mui/material';
import ProjectTeamBuilder from './ProjectTeamBuilder';
import KyotsuDialog from '../../components/KyotsuDialog';


interface TeamMember {
    name: string; role: string;
}
interface ProjectData {
    projectManager: TeamMember; teamMembers: TeamMember[];
}
const ProjectManagementParent: React.FC = () => {
    const [isDialogopen, setIsDialogopen] = useState(false);
    const [projecTeam, setProjectTeam] = useState<ProjectData | null>(null);

    const openDialog = () => {
        setIsDialogopen(true);
    };

    const closeDialog = (data?: ProjectData) => {
        setIsDialogopen(false);
        if (data) {
            setProjectTeam(data);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Team編成</Typography>
                <Button variant="contained" color="primary" onClick={openDialog}>
                    チームを編成する
                </Button>
            </Box>
            {projecTeam && (
                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom>プロジェクトチーム</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary={`プロジェクトマネージャー: ${projecTeam.projectManager.name}`} secondary={`役割: ${projecTeam.projectManager.role}`} />
                        </ListItem>
                        {projecTeam.teamMembers.map((member, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`メンバー${index + 1}: ${member.name}`} secondary={`役割: ${member.role}`} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
            <KyotsuDialog<ProjectData, ProjectData>
                openDialog={isDialogopen}
                onCloseDialog={closeDialog}
                initialData={projecTeam || {projectManager:{name:'',role:''},teamMembers:[]}}
            >
                <ProjectTeamBuilder />
            </KyotsuDialog>

        </Container>

    )
};

export default ProjectManagementParent;