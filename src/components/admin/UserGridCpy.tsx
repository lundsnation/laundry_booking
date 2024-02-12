import {
    IconButton,
    InputAdornment,
    Skeleton,
    Button,
    Container,
    Paper,
    Grid,
    TextField,
    MenuItem,
    AlertColor,
    CircularProgress,
    ButtonGroup,
    Typography,
    SnackbarOrigin,
    TableFooter,
    Stack,
    Toolbar
} from "@mui/material";
import {Table, TableBody, TableHead, TableRow, TableContainer, TableCell, TablePagination} from "@mui/material"
import {Snack, SnackInterface} from "../Snack"
import {useState} from "react";
import {Checkbox} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import NewUserDialog from "./NewUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteUserDialog from "./DeleteUserDialog";
import SearchIcon from '@mui/icons-material/Search';
import User from "../../classes/User";

interface Props {
    user: User
}

const UserGrid = ({user}: Props) => {
    const [selected, setSelected] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left'}
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "info",
        alignment: alignment
    })
    const [searchString, setSearchString] = useState("")
    const [searchedUsers, setSearchedUsers] = useState<User[]>([])

    //Osäker på om denna behövs med tanke på att vi använder getServerSideprops
    const getTableContentSkelton = () => {
        let content = []
        for (let i = 0; i < rowsPerPage; i++) {
            content.push(
                <TableRow key={"Skeleton" + i}>
                    <TableCell padding="checkbox"><Skeleton variant="rounded" height="24px" width="24px"/></TableCell>
                    <TableCell component="th" scope="row" padding="none"><Skeleton/></TableCell>
                    <TableCell align="right"><Skeleton/></TableCell>
                    <TableCell align="right"><Skeleton/></TableCell>
                    <TableCell align="right"><Skeleton/></TableCell>
                </TableRow>
            )
        }
        return content
    }

    const handleClick = (event: React.MouseEvent<unknown>, user: User) => {
        if (!isSelected(user)) {
            const newSelected: Users = selected.add(user)
            setSelected(newSelected)
            return
        }
        const newSelected = selected.remove(user)
        setSelected(newSelected)
    }

    const handleSearchedUsers = (searchString: string) => {
        if (searchString === "") {
            setSearchedUsers(users)
        }
        const lowerCaseSearchString = searchString.toLowerCase()
        setSearchString(searchString)
        const searchedUsers = users.filter(user => user.name.toLowerCase().includes(lowerCaseSearchString) || user.email.toLowerCase().includes(lowerCaseSearchString))
        setSearchedUsers(searchedUsers)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length()) : 0;

    const isSelected = (user: User) => selected.contains(user);

    const getContent = () => {
        // let display: Users = searchString != "" ? searchedUsers : users
        let display: Users = searchedUsers

        //console.log(searchString)
        //console.log("Display", display)
        display = display.sort((a, b) => {
            return a.name.localeCompare(b.name, 'sv')
        });
        return (
            display.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userEntry, index) => {
                const isItemSelected = isSelected(userEntry)
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                    <TableRow
                        hover
                        role="checkbox"
                        onClick={(event) => handleClick(event, userEntry)}
                        key={userEntry.name}
                        tabIndex={-1}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        selected={isItemSelected}
                    ><TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} inputProps={{'aria-labelledby': labelId,}}/>
                    </TableCell>
                        <TableCell component="th" scope="row" id={labelId} padding="none">
                            {userEntry.name}
                        </TableCell>
                        <TableCell align="right">{userEntry.email}</TableCell>
                        <TableCell align="right">{userEntry.allowedSlots}</TableCell>
                        <TableCell align="right">{userEntry.telephone}</TableCell>
                        <TableCell align="right">{userEntry.hasAcceptedTerms ? "Ja" : "Nej"}</TableCell>
                    </TableRow>
                )
            })
        )
    }

    //Istället för att fetcha om users efter varje ändring så kan vi bara ändra i listan. 
    return (
        <Paper sx={{width: {lg: '1200px'}}} elevation={0} variant={"outlined"}>
            <Grid item xs={12}>
                <Typography variant="h5" sx={{m: 2}}> Redigera Användare</Typography>
            </Grid>
            <Snack handleClose={() => {
                setSnack(snack => ({...snack, show: false}))
            }} state={snack}></Snack>
            <NewUserDialog
                showAddDialog={showAddDialog}
                setShowAddDialog={setShowAddDialog}
                snack={snack}
                setSnack={setSnack}
                setUsers={setUsers}
            />
            <EditUserDialog
                showEditDialog={showEditDialog}
                setShowEditDialog={setShowEditDialog}
                snack={snack}
                setSnack={setSnack}
                selected={selected}
                setSelected={setSelected}
                users={users}
                setUsers={setUsers}
            />
            <DeleteUserDialog
                showDeleteUserDialog={showDeleteUserDialog}
                setShowDeleteUserDialog={setShowDeleteUserDialog}
                selected={selected}
                setSelected={setSelected}
                searchedUsers={searchedUsers}
                setSearchedUsers={setSearchedUsers}
                users={users}
                setUsers={setUsers}
                snack={snack}
                setSnack={setSnack}
            />
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 750}} size='small' aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell padding="none">Användare</TableCell>
                            <TableCell align="right">E-post</TableCell>
                            <TableCell align="right">Tillåtna Bokningar</TableCell>
                            <TableCell align="right">Telefon</TableCell>
                            <TableCell align="right">Accepterat Villkor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length() > 0 || !loadingData ? getContent() : getTableContentSkelton()}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 33 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container alignItems='flex-end' justifyContent="stretch">
                <Grid item xs={12} sm={6} md={2.5}>
                    <TextField
                        fullWidth
                        variant={'outlined'}
                        size="medium"
                        label="Sök efter användare"
                        onChange={(e) => {
                            handleSearchedUsers(e.target.value)
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ButtonGroup fullWidth sx={{height: '56px'}} orientation='horizontal' size="small"
                                 variant="outlined">
                        <Button fullWidth onClick={() => {
                            setShowDeleteUserDialog(true)
                        }} disabled={selected.length() === 0} size='small' color="error" startIcon={<DeleteIcon/>}> Ta
                            Bort</Button>
                        <Button fullWidth onClick={() => {
                            setShowEditDialog(true)
                        }} disabled={selected.length() === 0} size='small' color="warning"
                                startIcon={<EditOutlinedIcon/>}>Ändra</Button>
                        <Button fullWidth onClick={() => {
                            setShowAddDialog(true)
                        }} size='small' color="primary" startIcon={<PersonAddOutlinedIcon/>}>Lägg till</Button>
                    </ButtonGroup>
                </Grid>

                <Grid item md={0.5}/>

                <Grid item xs={12} sm={12} md={5} justifyContent={'right'}>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={users.length()}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Användare per sida"
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
export default UserGrid;