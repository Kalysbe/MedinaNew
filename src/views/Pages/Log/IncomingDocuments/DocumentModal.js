import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  Grid,
  InputLabel,
  Snackbar,
  Typography,
  Divider
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { fetchCreateDocument } from "redux/actions/documents";

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginLeft: "auto",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  searchInput: {
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  dialogPaper: {
    zIndex: 2000,
    maxHeight: '980px',
    height: '60%'
  },
  alert: {
    background: '#f44336',
    color: '#fff',
    padding: theme.spacing(1.5),
    borderRadius: 4,
    textAlign: 'center',
    minWidth: '200px'
  },
  success: {
    background: '#4caf50'
  },
  error: {
    background: '#f44336'
  },
  docItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 0),
  },
  docTitle: {
    fontWeight: 600,
  },
  docDetails: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
  },
  datePicker: {
    zIndex: 3000,
  }
}));

export default function DocumentSelectorModal({
  open,
  onClose,
  onSelect,
  documents,
  emitentId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: "",
    provider_name: "",
    signer_name: "",
    receipt_date: moment().format("DD-MM-YYYY")
  });
  const [localDocs, setLocalDocs] = useState(documents);

  useEffect(() => {
    setLocalDocs(documents);
  }, [documents]);

  const filteredDocuments = localDocs.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    const formatted = moment(value).format("DD-MM-YYYY");
    if (moment(formatted, "DD-MM-YYYY", true).isValid()) {
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }
  };

  const handleCreate = async () => {
    const newDoc = { emitent_id: emitentId, ...formData };
    const response = await dispatch(fetchCreateDocument(newDoc));

    if (!response.error && response.payload) {
      const createdDoc = response.payload;
      setLocalDocs((prev) => [createdDoc, ...prev]);
      setFormData({
        title: "",
        provider_name: "",
        signer_name: "",
        receipt_date: moment().format("DD-MM-YYYY")
      });
      setSnackbar({ open: true, message: 'Документ добавлен', severity: 'success' });
      setSearch("");
      setTimeout(() => {
        setShowAddForm(false);
        onSelect(createdDoc);
      }, 100);
    } else {
      const errorMessage = response?.payload?.message || response?.error?.message || 'Произошла ошибка';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        classes={{ paper: classes.dialogPaper }}
      >
        <div className={classes.headerRow}>
          <DialogTitle>{showAddForm ? "Добавить документ" : "Выберите входящий документ"}</DialogTitle>
          {!showAddForm && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowAddForm(true)}
            >
              Добавить
            </Button>
          )}
        </div>
        <DialogContent>
          {!showAddForm ? (
            <>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Поиск по названию документа"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={classes.searchInput}
              />
              <List>
                {filteredDocuments.map((doc) => (
                  <ListItem button key={doc.id} onClick={() => onSelect(doc)} className={classes.docItem}>
                    <ListItemText
                      primary={<Typography className={classes.docTitle}>{doc.title}</Typography>}
                      secondary={
                        <Typography className={classes.docDetails}>
                          Отправитель: {doc.provider_name} | Подписал: {doc.signer_name}  | Получено: {doc.receipt_date} 
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {filteredDocuments.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Документы не найдены" />
                  </ListItem>
                )}
              </List>
            </>
          ) : (
            <Grid container spacing={2} className={classes.datePicker} style={{ marginTop: 8 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Название документа"
                  name="title"
                  value={formData.title}
                  onChange={handleFieldChange}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ФИО отправителя"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleFieldChange}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ФИО подписавшего"
                  name="signer_name"
                  value={formData.signer_name}
                  onChange={handleFieldChange}
                  className={classes.formField}
                />
              </Grid>
         
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Дата получения</InputLabel>
                <Datetime
                  inputProps={{ placeholder: "ДД-MM-ГГГГ" }}
                  timeFormat={false}
                  dateFormat="DD-MM-YYYY"
                  closeOnSelect
                  value={moment(formData.receipt_date, "DD-MM-YYYY")}
                  onChange={(val) => handleDateChange("receipt_date", val)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {showAddForm ? (
            <>
              <Button onClick={() => setShowAddForm(false)} color="default">
                Отмена
              </Button>
              <Button onClick={handleCreate} color="primary">
                Сохранить
              </Button>
            </>
          ) : (
            <Button onClick={onClose} color="secondary">
              Закрыть
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <div className={`${classes.alert} ${classes[snackbar.severity]}`}>
          {snackbar.message}
        </div>
      </Snackbar>
    </>
  );
}
