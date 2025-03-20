import React, { useState } from 'react';
import { Button, Typography, Box, ListItem, ListItemText, List } from '@mui/material';
import KyotsuDialog, { DialogChildProps, DialogSize } from '../../components/KyotsuDialog';
import TeamMemberSelector from './TeamMemberSelecter';




interface TeamMember {
    name: string;
    role: string;
}

interface ProjectData {
    projectManager: TeamMember;
    teamMembers: TeamMember[];
}

interface DepartmentData {
    department: '営業' | '開発' | '設計';
}

const ProjectTeamBuilder: React.FC<DialogChildProps<ProjectData, ProjectData>> & {
    dialogSize?: DialogSize;
    dialogTitle?: string;
} = ({ onClose, initialData }) => {
    const [team, setTeam] = useState<ProjectData>(initialData || { projectManager: { name: '', role: '' }, teamMembers: [] });
    const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState<DepartmentData['department']>('開発');

    const handleManagerSelect = (member: TeamMember | undefined) => {
        if (member) {
            setTeam(prevTeam => ({ ...prevTeam, projectManager: member }));
        }
        setIsManagerDialogOpen(false);
    };

    const handleMemberSelect = (member: TeamMember | undefined) => {
        if (member) {
            setTeam(prevTeam => ({
                ...prevTeam,
                teamMembers: [...prevTeam.teamMembers, member].slice(0, 5)
            }));
        }
        setIsMemberDialogOpen(false);
    };

    const handleSubmit = () => {
        onClose?.(team)
    }
    const openManagerDialog = (department: DepartmentData['department']) => {
        setCurrentDepartment(department);
        setIsManagerDialogOpen(true);
    }
    const openMemberDialog = (department: DepartmentData['department']) => {
        setCurrentDepartment(department);
        setIsMemberDialogOpen(true);
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                プロジェクトチームを編成する
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    プロジェクトマネージャー
                </Typography>
                {team?.projectManager.name ? (
                    <ListItem>
                        <ListItemText primary={team.projectManager.name} secondary={team.projectManager.role} />
                    </ListItem>
                ) : (
                    <Box>
                        <Button variant="outlined" onClick={() => openManagerDialog('営業')} sx={{ mr: 1 }}>
                            営業部門から選択
                        </Button>
                        <Button variant="outlined" onClick={() => openManagerDialog('開発')} sx={{ mr: 1 }}>
                            開発部門から選択
                        </Button>
                        <Button variant="outlined" onClick={() => openManagerDialog('設計')} sx={{ mr: 1 }}>
                            設計部門から選択
                        </Button>
                    </Box>
                )}
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">チームメンバー</Typography>
                <List>
                    {team.teamMembers.map((member, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={member.name} secondary={member.role} />
                        </ListItem>
                    ))}
                </List>
                {team.teamMembers.length < 5 && (
                    <Box>
                        <Button variant="contained" onClick={() => openMemberDialog('営業')} sx={{ mr: 1 }}>
                            営業部門から追加
                        </Button>
                        <Button variant="contained" onClick={() => openMemberDialog('開発')} sx={{ mr: 1 }}>
                            開発部門から追加
                        </Button>
                        <Button variant="contained" onClick={() => openMemberDialog('設計')}>
                            設計部門から追加
                        </Button>
                    </Box>
                )}
            </Box>
            <Button variant="contained" onClick={handleSubmit} disabled={!team.projectManager.name}>
                チーム編成を完了
            </Button>

            <KyotsuDialog<DepartmentData, TeamMember>
                openDialog={isManagerDialogOpen}
                onCloseDialog={handleManagerSelect}
                initialData={{ department: currentDepartment }}
            >
                <TeamMemberSelector />
            </KyotsuDialog>
            <KyotsuDialog<DepartmentData, TeamMember>
                openDialog={isMemberDialogOpen}
                onCloseDialog={handleMemberSelect}
                initialData={{ department: currentDepartment }}
            >
                <TeamMemberSelector />
            </KyotsuDialog>

        </Box >
    )

}
ProjectTeamBuilder.dialogSize = DialogSize.MD;
ProjectTeamBuilder.dialogTitle = 'プロジェクトチーム編成';

export default ProjectTeamBuilder;