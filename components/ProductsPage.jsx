"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TextField,
  Button,
  TablePagination,
  Modal,
  Select,
  MenuItem,
  Box,
  Typography
} from "@mui/material";
import styled from "@emotion/styled";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ReactSortable } from "react-sortablejs";
const Wrapper = styled.div`
  color: white;
  min-height: 100vh;

  * {
    color: white;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  background-color: black;
`;

const StyledTableCell = styled(TableCell)`
  color: white;
  cursor: pointer;
`;
const SearchBarContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: black;
  width: 100%;
`;
const SearchIcon = styled(Button)`
  padding: 5px 0px 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SearchInput = styled(TextField)`
  padding: 8px 35px 8px 10px;
  font-size: 16px;
  width: 100%;
  background: black;
  font-family: Arial, Helvetica, sans-serif;
`;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color:"black",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

const StyledFile = styled.img`
  width: 300px;
border-bottom: 1px solid gray;

  cursor: pointer;
  border-radius: 8px;
  object-fit: cover;
`;

const FilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const FilesSecondContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-around;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  margin: 10px;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "rgba(0, 0, 0, 0.2)"};
  background-size: cover;
  background-position: center;
`;

const StyledBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-top: 15px;
  border-radius: 8px;
`;
const SmallButton = styled.button`
  max-height: 25px;
  padding: 5px 10px;
  background-color: ${(props) => (props.red ? "darkred" : "black")};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  min-width: fit-content;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: black;
  }
`;

export default function ProductsPage({ collection }) {
  const [rows, setRows] = useState(collection);
  const [searchText, setSearchText] = useState("");
  const [files, setFiles] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [formValues, setFormValues] = useState({
    carId: "",
    carTitle: selectedCar?.title || "",
    salePrice: "",
    paymentMethod: "",
    downPayment: "",
    interestRate: "",
    buyer: {
      name: "",
      contactInfo: {
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
        },
      },
    },
    adminNotes: "",
  });
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState({
    fileName: "",
    fileType: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangefile = (e) => {
    const { name, value } = e.target;
    setFileData((prev) => ({ ...prev, [name]: value }));
  };

  const fileinformation = () => {
    handleOpen();
  };
  function updateFileOrder(newFiles) {
    setFiles(newFiles);
  }
    const [isUploading, setIsUploading] = useState(false);

    async function uploadFiles(ev) {
      fileinformation()
      const files = ev.target?.files;
      if (files?.length > 0) {
        setIsUploading(true);
        const data = new FormData();
        for (const file of files) {
          data.append("file", file);
        }
  
        const response = await fetch("/api/uploadMultipleFiles", {
          method: "POST",
          body: data,
        });
  
        const responseData = await response.json();
        console.log(responseData);
  
        setFiles((oldFiles) => {
          return [...oldFiles, ...responseData.links];
        });
  
        setIsUploading(false);
      }
    }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      console.log(formValues);
      console.log(formValues.paymentMethod);
      console.log(selectedCar.id)
      const response = await fetch("/api/madesale", {
        method: "POST",
        body: JSON.stringify({
          carId: selectedCar?._id,
          sale: formValues,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sale recorded:", data);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to record sale:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedRows = [...rows].sort((a, b) => {
      if (a[key] === b[key]) return 0;
      return a[key] < b[key]
        ? direction === "ascending"
          ? -1
          : 1
        : direction === "ascending"
        ? 1
        : -1;
    });
    setRows(sortedRows);
  };

  const handleSearch = () => {
    const filteredRows = collection.filter(
      (row) =>
        row.title.toLowerCase().includes(searchText.toLowerCase()) ||
        row.carMake.toLowerCase().includes(searchText.toLowerCase())
    );
    setRows(filteredRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const toggleSoldStatus = async (id, currentSoldStatus) => {
    const car = rows.find((row) => row._id === id); // Find the selected car
    if (car) {
      setSelectedCar(car); // Set the selected car
      setFormValues({
        ...formValues,
        carId: car._id,
        carTitle: car.title,
        salePrice: car.price,
      });
      setModalOpen(true); // Open the modal
    } else {
      console.error("Car not found");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCar(null);
    setFormValues({
      carId: "",
      carTitle: "",
      salePrice: "",
      paymentMethod: " ",
      downPayment: "",
      interestRate: "",
      buyer: {
        name: "",
        contactInfo: {
          email: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
          },
        },
      },
      adminNotes: "",
    }); // Reset form values
  };

  return (
    <Wrapper>
      <Link href={"/stock/post-product"}> post new Product</Link>
      <SearchBarContainer>
        <SearchInput
          placeholder="Search by title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            style: { color: "white" },
          }}
        />
        <SearchIcon onClick={handleSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </SearchIcon>
      </SearchBarContainer>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell onClick={() => handleSort("type")}>
                Type
              </StyledTableCell>
              <StyledTableCell>File</StyledTableCell>
              <StyledTableCell onClick={() => handleSort("title")}>
                Title
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("price")}>
                Price
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("timeInInventory")}>
                Time in Inventory
              </StyledTableCell>
              <StyledTableCell>Sold</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row._id}>
                  <StyledTableCell>{row._id}</StyledTableCell>
                  <StyledTableCell>{row.carMake}</StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={row.images[0]}
                      alt={row.title}
                      style={{
                        widt: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link href={`/stock/edit-product/${row._id}`} passHref>
                      {row.title}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell>${row.price}</StyledTableCell>
                  <StyledTableCell>
                    {" "}
                    {formatDistanceToNow(new Date(row.createdAt), {
                      addSuffix: true,
                    })}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Switch
                      checked={row.sold}
                      onChange={() => toggleSoldStatus(row._id, row.sold)}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableContainer>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle, width: 500 }}>
          <h2>Enter Sale Details for {selectedCar?.title}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Car Title"
              name="carTitle"
              value={formValues.carTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Sale Price"
              name="salePrice"
              type="number"
              value={formValues.salePrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Select
              label="Payment Method"
              name="paymentMethod"
              value={formValues.paymentMethod}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Full Price">Full Price</MenuItem>
              <MenuItem value="Financed">Financed</MenuItem>
              <MenuItem value="Lease">Lease</MenuItem>
            </Select>
            {formValues.paymentMethod === "Financed" && (
              <>
                <TextField
                  label="Down Payment"
                  name="downPayment"
                  type="number"
                  value={formValues.downPayment}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Interest"
                  name="interestRate"
                  type="number"
                  value={formValues.interestRate}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            <TextField
              label="Buyer Name"
              name="buyer.name"
              value={formValues.buyer.name}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  buyer: { ...formValues.buyer, name: e.target.value },
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Buyer Email"
              name="buyer.contactInfo.email"
              value={formValues.buyer.contactInfo.email}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  buyer: {
                    ...formValues.buyer,
                    contactInfo: {
                      ...formValues.buyer.contactInfo,
                      email: e.target.value,
                    },
                  },
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Admin Notes"
              name="adminNotes"
              value={formValues.adminNotes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
            
          
                        <FilesContainer>
                          <h1 style={{color:'black'}}>Files Container</h1>
                          <FilesSecondContainer>
                            <ReactSortable
                              list={files}
                              className="flex flex-wrap gap-1"
                              setList={updateFileOrder}
                            >
                              {!!files?.length &&
                                files.map((link, imgindex) => (
                                  <FilePreview key={link}>
                                    <h1>file{imgindex}</h1>
                                    <StyledFile src={link} alt="" />
                                    <SmallButton
                                      onClick={() => handleRemoveFile(imgindex)}
                                      red={true}
                                    >
                                      Remove
                                    </SmallButton>
                                  </FilePreview>
                                ))}
                            </ReactSortable>
                            {isUploading && <FilePreview>...loading</FilePreview>}
                            <UploadLabel style={{ width: "100px", height: "100px" }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-upload"
                              >
                                <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                                <line x1="12" y1="2" x2="12" y2="13"></line>
                              </svg>
                              <div>Add File</div>
                              <input
                                type="file"
                                onChange={uploadFiles}
                                className="hidden"
                              />
                            </UploadLabel>
                          </FilesSecondContainer>
                        </FilesContainer>


                        <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>

        </Box>
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            mx: "auto",
            mt: "15%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">Enter File Information</Typography>
          <TextField
            label="File Name"
            name="fileName"
            value={fileData.fileName}
            onChange={handleChangefile}
            fullWidth
          />
          <TextField
            label="File Type"
            name="fileType"
            value={fileData.fileType}
            onChange={handleChangefile}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => {
              console.log(fileData);
              handleClose();
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Wrapper>
  );
}
