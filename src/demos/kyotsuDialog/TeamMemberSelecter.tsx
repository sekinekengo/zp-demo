import React, { useCallback, useEffect, useState } from 'react';
import { Button, Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DialogChildProps, DialogSize } from '../../components/KyotsuDialog';

interface TeamMember {
    name: string;
    role: string;
}

// DepartmentDataの型定義を修正
type DepartmentType = "営業" | "開発" | "設計";

interface DepartmentData {
    department: DepartmentType;
}

const departmentMembers: Record<DepartmentType, TeamMember[]> = {
    "営業": [
        { name: "佐藤", role: "営業マネージャー" },
        { name: "田中", role: "アカウントエグゼクティブ" },
        { name: "高橋", role: "セールスレップ" },
    ],
    "開発": [
        { name: "山本", role: "開発マネージャー" },
        { name: "小林", role: "ソフトウェアエンジニア" },
        { name: "加藤", role: "ソフトウェアエンジニア" },
    ],
    "設計": [
        { name: "中村", role: "デザインマネージャー" },
        { name: "松本", role: "UI/UXデザイナー" },
        { name: "渡辺", role: "グラフィックデザイナー" },
    ],
};

// React.memoの使い方を修正し、パラメータ名の不一致を解決
const SalesTeamSelector = React.memo(({ onSelect }: { onSelect: (member: TeamMember) => void }) => {
    return (
        <Grid container spacing={2}>
            {departmentMembers["営業"].map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Button variant="outlined" onClick={() => onSelect(member)}>
                        {member.name} ({member.role})
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
});

const DevelopmentTeamSelector = React.memo(({ onSelect }: { onSelect: (member: TeamMember) => void }) => {
    return (
        <Grid container spacing={2}>
            {departmentMembers["開発"].map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Button variant="outlined" onClick={() => onSelect(member)}>
                        {member.name} ({member.role})
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
});

const DesignTeamSelector = React.memo(({ onSelect }: { onSelect: (member: TeamMember) => void }) => {
    return (
        <Grid container spacing={2}>
            {departmentMembers["設計"].map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Button variant="outlined" onClick={() => onSelect(member)}>
                        {member.name} ({member.role})
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
});

const TeamMemberSelector : React.FC<DialogChildProps<DepartmentData, TeamMember>> & {
    dialogSize?: DialogSize;
    dialogTitle?: string;
} = ({ onClose, initialData }) => {
    const [department, setDepartment] = useState<DepartmentData['department']>('開発');

    useEffect(() => {
        if (initialData) {
            setDepartment(initialData.department);
        }
    }, [initialData]);

    const handleSelect = useCallback((member: TeamMember) => {
        onClose?.(member);
    }, [onClose]);

    const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setDepartment(event.target.value as DepartmentData['department']);
    };

    return (
        <Box sx={{ p: 2 }}>
            <FormControl fullWidth>
                <InputLabel id='department-select-label'>部門</InputLabel>
                <Select
                    labelId='department-select-label'
                    id='department-select'
                    value={department}
                    onChange={handleDepartmentChange}
                    label="部門"
                >
                    <MenuItem value='営業'>営業</MenuItem>
                    <MenuItem value='開発'>開発</MenuItem>
                    <MenuItem value='設計'>設計</MenuItem>
                </Select>
            </FormControl>
            <Typography variant='h6' sx={{ mt: 2 }}>{department}部門からメンバーを選択</Typography>
            {department === '営業' && <SalesTeamSelector onSelect={handleSelect} />}
            {department === '開発' && <DevelopmentTeamSelector onSelect={handleSelect} />}
            {department === '設計' && <DesignTeamSelector onSelect={handleSelect} />}
        </Box>
    )

}

TeamMemberSelector.dialogSize = DialogSize.SM;
TeamMemberSelector.dialogTitle = 'メンバー選択';

export default TeamMemberSelector;