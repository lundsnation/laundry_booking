import { Box, Button, Container, Typography, Paper, Grid, Dialog, DialogActions, DialogTitle,List,ListItem,Divider, TextField,MenuItem,AlertColor} from "@mui/material";
import {Table, TableBody, TableHead, TableRow,TableContainer,TableCell, TablePagination} from "@mui/material"
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import NotLoggedIn from "../src/components/NotLoggedIn";
import NotAuthorized from "../src/components/NotAuthorized";
import { useEffect, useState } from "react";
import { UserType } from "../utils/types";
import Header from "../src/components/Header";
import {Checkbox} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Snack } from "../src/components/Snack";


//page is currently visible for all users
const admin: NextPage = () => {
    
    const { user, isLoading, error } = useUser()
    const [users, setUsers] = useState<Array<UserType>>([])
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showAddDialog,setShowAddDialog] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState("")
    const [newUserAllowedSlots, setNewUserAllowedSlots] = useState(0)
    const [newUserPhone, setNewUserPhone] = useState("")
    const [newUserApt, setNewUserApt] = useState("")
    const [newUserBulding, setNewUserBuilding] = useState("")
    const [showSnack,setShowSnack] = useState(false)
    const [snackString, setSnackString] = useState("")
    const fetchUsers= async () => {
        const res = await fetch("/api/user")
        const all : Array<UserType> = await res.json()
        return all 
    }

    let snackSeverity:AlertColor = "info"

    useEffect(()=>{
        const tempUsers : Array<UserType> = []
        let tempUser: UserType
        fetchUsers().then(userList => {
            userList.forEach(element => {
                    tempUsers.push(element)
                })
            setUsers(tempUsers)
        })
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
      };

      const handleAddUser = async () =>{
        const newUserName = newUserBulding + newUserApt.toString()
        const newUserApp_metadata = {acceptedTerms: false, allowedSlots: newUserAllowedSlots, roles: ["users"]}
        const newUserUser_metadata = {telephone: newUserPhone}
        const newUser:UserType = {name: newUserName, email:newUserEmail, app_metadata: newUserApp_metadata, user_metadata: newUserUser_metadata}
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const parsed = await response.json()
        if(parsed.ok){
            setShowSnack(true)
            snackSeverity = 'success'
            setSnackString("Användare " + newUser.name+" Skapad")
        }
      }

      const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };

      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

      const isSelected = (name: string) => selected.indexOf(name) !== -1;
    return (

        <Container >
            <Header/>
            {user && !isLoading ?
                <Box>
                    
                    {user.name == "admin" ?  
                    <Paper>
                        <Snack handleClose={()=>{setShowSnack(false)}} state={{show: showSnack, snackString : snackString, severity : snackSeverity}}></Snack>
                        <Dialog open={showAddDialog} 
                                onClose = {()=>{setShowAddDialog(false)}}
                                >
                                <DialogTitle> Lägg till ny användare</DialogTitle>
                                <Divider variant="middle"/>
                                <List >
                                    <ListItem >
                                    <TextField
                                        id="select-building"
                                        margin="dense"
                                        select
                                        fullWidth
                                        value={newUserBulding}
                                        onChange={(e)=>{
                                            setNewUserBuilding(e.target.value)
                                        }}
                                        label="Välj Byggnad"
                                        helperText="Välj Byggnad"
                                        >
                                      <MenuItem key={"NH"} value={"NH"}>
                                            NH
                                      </MenuItem>
                                      <MenuItem key={"GH"} value={"GH"}>
                                            GH
                                      </MenuItem>
                                      </TextField>
                                    </ListItem>    
                                    <ListItem>
                                    <TextField
                                        required
                                        value={newUserApt}
                                        onChange={(e)=>{
                                            setNewUserApt(e.target.value)
                                        }}
                                        margin="dense"
                                        fullWidth
                                        id="input-apt-number"
                                        label="Lägenhetsnummer"
                                        helperText="4 siffror"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        value={newUserPhone}
                                        onChange={(e)=>{
                                            setNewUserPhone(e.target.value)
                                        }}
                                        id="input-phone-number"
                                        label="Telefon"
                                        helperText="Riktnummer enbart vid utländskt nummer"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        value={newUserEmail}
                                        onChange={(e)=>{
                                            setNewUserEmail(e.target.value)
                                        }}
                                        id="input-email"
                                        label="E-post"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        type="number"
                                        value={newUserAllowedSlots}
                                        onChange={(e)=>{
                                            setNewUserAllowedSlots(Number(e.target.value))
                                        }}
                                        id="select-allowedSlots"
                                        label="Tillåtna Bokningar"
                                        helperText="Antal bokningar en användare kan göra per vecka"
                                        />
                                    </ListItem>
                                </List>   
                                <DialogActions>
                                    <Grid  container alignItems='center' justifyContent='flex-end'>
                                        <Grid>
                                            <Button color='warning' variant="outlined" onClick={()=>{setShowAddDialog(false)}}>Stäng</Button>
                                        </Grid>
                                        <Grid>
                                            <Button color='primary' variant="outlined" onClick={handleAddUser}>Skapa</Button>
                                        </Grid>
                                    </Grid>
                                    
                                </DialogActions>
                        </Dialog>
                        <Dialog open={showEditDialog}>TestEdit</Dialog>
                        <Typography variant="h5" sx={{padding:2}}>Användare:</Typography>
                        <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 750 }} size= 'small' aria-label="simple table">
                          <TableHead>
                            <TableRow >
                                <TableCell></TableCell>
                              <TableCell>Användare</TableCell>
                              <TableCell align="right">E-post</TableCell>
                              <TableCell align="right">Tillåtna Bokningar</TableCell>
                              <TableCell align="right">Telefon</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((userEntry,index) =>{ 
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
                            )}
                            )}
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
                      <Grid container alignItems='center' justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={()=>{setShowAddDialog(true)}} size = 'small' variant="outlined" color="primary"endIcon={<AddIcon/>}>Ny användare</Button>  
                        </Grid>
                        <Grid item>
                            <Button onClick={fetchUsers} size= 'small' variant="outlined" color="warning" endIcon={<EditIcon/>}>Ändra Vald</Button>  
                        </Grid>
                        <Grid item xs={6}>
                            <TablePagination
                                rowsPerPageOptions={[5,10,25]}
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
                        
                        :<NotAuthorized/>
                    }</Box>:<NotLoggedIn />
            }
        </Container>
    )
}

export default admin