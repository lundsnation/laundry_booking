import {IconButton,InputAdornment, Skeleton, Button, Container,  Paper, Grid,  TextField,MenuItem,AlertColor, CircularProgress, ButtonGroup, Typography, SnackbarOrigin} from "@mui/material";
import {Table, TableBody, TableHead, TableRow,TableContainer,TableCell, TablePagination} from "@mui/material"
import { useUser } from '@auth0/nextjs-auth0/client';
import { Snack, SnackInterface } from "../Snack"
import { FormEvent, useEffect, useState } from "react";
import { UserType } from "../../../utils/types";
import {Checkbox} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import NewUserDialog from "./NewUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteUserDialog from "./DeleteUserDialog";
import SearchIcon from '@mui/icons-material/Search';


const UserGrid = () => {
    const { user, isLoading, error } = useUser()
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)
    const [showAddDialog,setShowAddDialog] = useState(false)
    const [loadingData,setLoadingData] = useState(false)
    const [users, setUsers] = useState<Array<UserType>>([])
    const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left' }
    const [snack, setSnack] = useState<SnackInterface>({show:false,snackString:"",severity:"info", alignment: alignment})
    const [searchString, setSearchString] = useState("")
    const [searchedUsers, setSearchedUsers] = useState<Array<UserType>>([])
    const fetchUsers= async () => {
        setLoadingData(true)
        const res = await fetch("/api/user")
        const all : Array<UserType>  = await res.json()
        const tempUsers : Array<UserType> = []
        if(res.ok){
            try{
                all.forEach(element => {
                    tempUsers.push(element)
                    setUsers(tempUsers)
                })
            }catch(error : any){
                setSnack({show:true, severity:'error', snackString:String(error)})
                console.log(error)
            }
        }
        setLoadingData(false)
    }

    const getTableContentSkelton = () => {
        let content = []
        for(let i = 0;i<rowsPerPage;i++){
            content.push(
                <TableRow key={"Skeleton"+i}>
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

    useEffect(()=>{
        fetchUsers()
    },[])

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        setSelected(newSelected);
      }

      // SEARCH
      useEffect(()=>{
        let searchRes = users.filter(user => user.name.includes(searchString))
        setSearchedUsers(searchRes)
    },[searchString])

      const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      }

      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      }
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

      const isSelected = (name: string) => selected.indexOf(name) !== -1;

      const getContent = ()=>{
        let display : Array<UserType>  = searchString != "" ? searchedUsers : users
        display = display.sort((a,b) => {
            return a.name.localeCompare(b.name, 'sv');
        });
        return ( 
            display.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userEntry,index) =>{ 
                    const isItemSelected = isSelected(userEntry.name)
                    const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                            <TableRow
                                hover
                                role="checkbox"
                                onClick={(event) => handleClick(event, userEntry.name)}
                                key={userEntry.name}
                                tabIndex={-1}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                selected={isItemSelected}
                            ><TableCell padding="checkbox">
                                    <Checkbox color="primary" checked={isItemSelected} inputProps={{'aria-labelledby': labelId,}}/>
                            </TableCell>
                                <TableCell component="th" scope="row" id={labelId} padding="none">
                                {userEntry.name}
                                </TableCell>
                                <TableCell align="right">{userEntry.email}</TableCell>
                                <TableCell align="right">{userEntry.app_metadata?.allowedSlots}</TableCell>
                                <TableCell align="right">{userEntry.user_metadata?.telephone}</TableCell>
                            </TableRow> 
                                )
                            }
                        )
                    )
      }

    return(
        <Container disableGutters>
            <Paper elevation={0} variant={"outlined"}>
                <Grid xs={12}>
                    <Typography variant="h5" sx={{m:2}}> Redigera Användare</Typography>
                </Grid>
            <Snack handleClose={()=>{setSnack(snack =>({...snack,show:false}))}} state={snack}></Snack>
            <NewUserDialog 
                showAddDialog={showAddDialog} 
                setShowAddDialog={setShowAddDialog} 
                snack={snack} 
                setSnack={setSnack}
                fetchUsers={fetchUsers}
                />
            <EditUserDialog
                showEditDialog={showEditDialog}
                setShowEditDialog={setShowEditDialog}
                snack={snack}
                setSnack={setSnack}
                fetchUsers={fetchUsers}
                selected={selected}
                setSelected={setSelected}
                users={users}
            />
            <DeleteUserDialog
                showDeleteUserDialog ={showDeleteUserDialog}
                setShowDeleteUserDialog = {setShowDeleteUserDialog}
                selected ={selected}
                setSelected ={setSelected}
                users = {users}
                fetchUsers = {fetchUsers}
                snack={snack}
                setSnack={setSnack}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} size= 'small' aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <TableCell></TableCell>
                    <TableCell padding="none">Användare</TableCell>
                    <TableCell align="right">E-post</TableCell>
                    <TableCell align="right">Tillåtna Bokningar</TableCell>
                    <TableCell align="right">Telefon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.length>0||!loadingData ? getContent():getTableContentSkelton()}
                    {emptyRows > 0 && (
                        <TableRow
                            style={{
                                height: 33 * emptyRows,
                             }}
                        >
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            <Grid container alignItems='flex-end' justifyContent="stretch">
                
                <Grid item xs={12} sm={6} md ={3}>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Sök efte användare"
                        onChange={(e)=>{
                            setSearchString(e.target.value)
                        }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                </Grid>
                <Grid item xs={12} sm={6} md ={3}>

                    <ButtonGroup size ="large" variant="outlined" sx={{height:"105%"}}>
                        <Button fullWidth onClick={() =>{setShowDeleteUserDialog(true)}} disabled = {selected.length == 0} size= 'small' color="error" ><DeleteIcon/> Ta Bort</Button>  
                        <Button fullWidth onClick={() =>{setShowEditDialog(true)}} disabled = {selected.length == 0} size= 'small'  color="warning" ><EditOutlinedIcon/> Ändra</Button> 
                        <Button fullWidth onClick={()=>{setShowAddDialog(true)}} size = 'small'  color="primary"><PersonAddOutlinedIcon/> Lägg Till</Button>  
                    </ButtonGroup>
                   
                </Grid>

                    

               
                <Grid item xs={12} sm={12} md={6}>
                    <TablePagination
                        rowsPerPageOptions={[10,25,50]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Användare per sida"
                    />
                </Grid>

            </Grid>
            </Paper>
            </Container>
    )
}
export default UserGrid;