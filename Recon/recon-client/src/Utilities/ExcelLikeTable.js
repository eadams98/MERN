import { faLink, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState, forwardRef, useImperativeHandle} from "react"
import { Button, Form, Col, Row, Alert, Card, Modal, ModalBody, ModalFooter, Container, InputGroup, FormControl} from 'react-bootstrap';
import styleTest from '../CSS/Modules/ExcelLikeTable.module.css';
import useAxiosPersonal from "../Hooks/useAxiosPersonal";
//import swal from "sweetalert";

const ExcelLikeTable = forwardRef((props, ref) => {
    // Hooks
    const axios = useAxiosPersonal()

    let data = []
    const [tableSort, setTableSort] = useState([true, true, true, true, true])
    const [selectedColumn, setSelectedColumn] = useState("")
    const [isPopupVisable, setIsPopupVisable] = useState(false)
    const [popupForm, setPopupForm] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [counter, setCounter] = useState(0)
    const [deleteList, setDeleteList] = useState(new Set())
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [snapshot, setSnapshot] = useState({
        tableBody: [],
        displayBody: [],
        tableFilter: [],
        tableSet: [],
    })

    const [pagination, setPagination] = useState({
        currentPage: 1,
        arrayPage: 0,
        totalPages: 1,
        tableSize: 20
    })
    const [focusTableInput, setFocusTableInput] = useState(false)

    const [table, setTable] = useState({
        head: ["fake col 1","fake col 2","fake col 3","fake col 4","fake col 5"],
        body: [
            ["row 1 col 1","row 1 col 2","row 1 col 3","row 1 col 4","row 1 col 5"],
            ["row 2 col 1","row 2 col 2","row 2 col 3","row 2 col 4","row 2 col 5"],
            ["row 3 col 1 SUPER LONG NAME GOES HERE TO DEMONSTRATE THE SCROLLABILTIY","row 3 col 2","row 3 col 3","row 3 col 4","row 3 col 5"],
            ["row 4 col 1","row 4 col 2","row 4 col 3","row 4 col 4","row 4 col 5"],
            ["row 5 col 1","row 5 col 2","row 5 col 3","row 5 col 4","row 5 col 5"],
            ["Select All 1","Select All 2","Select All 3","Select All 4","Select All 5"]
        ]
    })
    const[displayTable, setDisplayTable] = useState( [
      ["row 1 col 1","row 1 col 2","row 1 col 3","row 1 col 4","row 1 col 5"],
      ["row 2 col 1","row 2 col 2","row 2 col 3","row 2 col 4","row 2 col 5"],
      ["row 3 col 1 SUPER LONG NAME GOES HERE TO DEMONSTRATE THE SCROLLABILTIY","row 3 col 2","row 3 col 3","row 3 col 4","row 3 col 5"],
      ["row 4 col 1","row 4 col 2","row 4 col 3","row 4 col 4","row 4 col 5"],
      ["row 5 col 1","row 5 col 2","row 5 col 3","row 5 col 4","row 5 col 5"],
      ["Select All 1","Select All 2","Select All 3","Select All 4","Select All 5"]
    ])

    /*let [tableFilter, setTableFilter] = useState([
                                            [true,true,true,true,true],
                                            [true,true,true,true,true],
                                            [true,true,true,true,true],
                                            [true,true,true,true,true],
                                            [true,true,true,true,true],
                                            [true,true,true,true,true]
                                        ])*/

    let [tableFilter, setTableFilter] = useState([
        {"row 1 col 1": true, "row 1 col 2": true, "row 1 col 3": true, "row 1 col 4": true, "row 1 col 5":true},
        {"row 2 col 1": true, "row 2 col 2": true, "row 2 col 3": true, "row 2 col 4": true, "row 2 col 5":true},
        {"row 3 col 1 SUPER LONG NAME GOES HERE TO DEMONSTRATE THE SCROLLABILTIY": true, "row 3 col 2": true, "row 3 col 3": true, "row 3 col 4": true, "row 3 col 5":true},
        {"row 4 col 1": true, "row 4 col 2": true, "row 4 col 3": true, "row 4 col 4": true, "row 4 col 5":true},
        {"row 5 col 1": true, "row 5 col 2": true, "row 5 col 3": true, "row 5 col 4": true, "row 5 col 5":true},
        {"Select All 1": true, "Select All 2": true, "Select All 3": true, "Select All 4": true, "Select All 5":true}
    ])
    let [tableSet, setTableSet] = useState([
                                        new Set(["row 1 col 1", "row 1 col 2", "row 1 col 3", "row 1 col 4", "row 1 col 5"]), // col 1
                                        new Set(["row 2 col 1", "row 2 col 2", "row 2 col 3", "row 2 col 4", "row 2 col 5"]), // col 2
                                        new Set(["row 3 col 1 SUPER LONG NAME GOES HERE TO DEMONSTRATE THE SCROLLABILTIY", "row 3 col 2", "row 3 col 3", "row 3 col 4", "row 3 col 5"]),
                                        new Set(["row 4 col 1", "row 4 col 2", "row 4 col 3", "row 4 col 4", "row 4 col 5"]),
                                        new Set(["row 5 col 1", "row 5 col 2", "row 5 col 3", "row 5 col 4", "row 5 col 5"]),
                                        new Set(["Set All" ])
                                    ])

    let [tableSearch, setTableSearch] = useState([
        "",
        "",
        "",
        "",
        ""
    ])


    useImperativeHandle(ref, () => ({

    })); 
     
    let alterDeleteSet = (e, id) => {
        console.log(e, id, deleteList.has(id))
        if (e) {
            deleteList.add(id)
        } else {
            deleteList.delete(id)
        }
        console.log("delete list = ", deleteList)
    }

    let updateTableFilterAndSet = (update) => {
        // whenver we type in input box to change a field, we need to update the filter and set so that it remains in the display list and on the screen
        let copy = []
        console.log("object to build update", update)

        update.map(row => {
            let aTableSet = new Set()
            row.map(col => aTableSet.add(col))
            copy.push(aTableSet)
        })
        //copy.push(tableSet[tableSet.length-1]) THIS WAS RESPONSIBLE FOR DUPLICATE SELECT ALL 
        console.log("object to build update - set", copy)
        setTableSet(copy)

        copy = []

        update.map((rowData) => {
            let filter = {}
            rowData.map(col => {
                filter[col] = true
            })
            copy.push(filter)
        }) 
        copy.push(tableFilter[tableFilter.length-1])
        console.log("object to build update - filter(old v new)", tableFilter, copy)
        setTableFilter(copy)
        
    }

    // PAGINATION START

    let previousPage = async () => { 
      try {
        let resp = await axios.get('get-school-students', {
          params: {
            currentPage: pagination.currentPage - 1
          }
        })
        resp = resp.data
        console.log(resp.data, resp.data.pages)

        setPagination({
          currentPage: resp.data.currentPage,
          //arrayPage: 0,
          totalPages: resp.data.pages,
          tableSize: 20
      })

        let rows = []
        let tableFilter = []
        let tableSet = []
        let tableSearch =[]
        let headerNames = []
        let tableSort = []

        if (resp.data.list.length != 0) {
            Object.entries(resp.data.list?.[0]).map((entry) => {
                let [key, value] = entry;
                headerNames.push(key)
                tableSort.push(true)
            })
        }

        console.log(resp.data.list)
        resp.data.list.map((rowData) => {
            
            let row = new Array()
            let aTableFilter = new Object()
            let aTableSet = new Set()
            
            Object.entries(rowData).map((entry) => {
                
                let [key, value] = entry;
                console.log(rowData)

                row.push(value)
                aTableFilter[value] = true
                //tableSet.push( new Set([rowData]) )
                //tableSearch.push("")
            })
            rows.push(row)
            tableFilter.push(aTableFilter)
            tableSet.push( new Set(row) )
            tableSearch.push("")
            
        })

        let selectAllList = []
        let selectAllListForFilter = {}
        headerNames.map((headerName, idx) =>{
            selectAllList.push("Select All " + headerName)
            selectAllListForFilter["Select All " + headerName] = true
        })
        rows.push(selectAllList)
        tableFilter.push(selectAllListForFilter)
        tableSet.push( new Set(["Set All"]) )

        console.log(rows, tableFilter, tableSet, tableSearch)

        setTable({
            head: headerNames,
            body: rows
        })
        setTableSort(tableSort)
        setDisplayTable(rows)
        setTableSet(tableSet)
        setTableFilter(tableFilter)
        setTableSearch(tableSearch)
        
      } catch (error) {
        console.log(error)
      }
    }

    let nextPage = async () => { 
      //setPagination({  ...pagination, currentPage: pagination.currentPage + 1, arrayPage: pagination.arrayPage + 1 })
      console.log(`type of: ${typeof pagination.currentPage}`)
      try {
        let resp = await axios.get('get-school-students', {
          params: {
            currentPage: pagination.currentPage + 1
          }
        })
        resp = resp.data
        console.log(resp.data, resp.data.pages)

        setPagination({
          currentPage: resp.data.currentPage,
          //arrayPage: 0,
          totalPages: resp.data.pages,
          tableSize: 20
      })

        let rows = []
        let tableFilter = []
        let tableSet = []
        let tableSearch =[]
        let headerNames = []
        let tableSort = []

        if (resp.data.list.length != 0) {
            Object.entries(resp.data.list?.[0]).map((entry) => {
                let [key, value] = entry;
                headerNames.push(key)
                tableSort.push(true)
            })
        }

        console.log(resp.data.list)
        resp.data.list.map((rowData) => {
            
            let row = new Array()
            let aTableFilter = new Object()
            let aTableSet = new Set()
            
            Object.entries(rowData).map((entry) => {
                
                let [key, value] = entry;
                console.log(rowData)

                row.push(value)
                aTableFilter[value] = true
                //tableSet.push( new Set([rowData]) )
                //tableSearch.push("")
            })
            rows.push(row)
            tableFilter.push(aTableFilter)
            tableSet.push( new Set(row) )
            tableSearch.push("")
            
        })

        let selectAllList = []
        let selectAllListForFilter = {}
        headerNames.map((headerName, idx) =>{
            selectAllList.push("Select All " + headerName)
            selectAllListForFilter["Select All " + headerName] = true
        })
        rows.push(selectAllList)
        tableFilter.push(selectAllListForFilter)
        tableSet.push( new Set(["Set All"]) )

        console.log(rows, tableFilter, tableSet, tableSearch)

        setTable({
            head: headerNames,
            body: rows
        })
        setTableSort(tableSort)
        setDisplayTable(rows)
        setTableSet(tableSet)
        setTableFilter(tableFilter)
        setTableSearch(tableSearch)
        
      } catch (error) {
        console.log(error)
      }
      
    }

    let indexPage = (pageNumber) => {
        setPagination({  ...pagination, currentPage: pageNumber, arrayPage: pageNumber-1  })
    }

    let changePage = async () => {
        //console.log(e.target.value)
        if (pagination.currentPage <= pagination.totalPages && pagination.currentPage > 0) {
          try {
            let resp = await axios.get('get-school-students', {
              params: {
                currentPage: pagination.currentPage
              }
            })
            resp = resp.data
            console.log(resp.data, resp.data.pages)
    
            setPagination({
              currentPage: resp.data.currentPage,
              //arrayPage: 0,
              totalPages: resp.data.pages,
              tableSize: 20
          })
    
            let rows = []
            let tableFilter = []
            let tableSet = []
            let tableSearch =[]
            let headerNames = []
            let tableSort = []
    
            if (resp.data.list.length != 0) {
                Object.entries(resp.data.list?.[0]).map((entry) => {
                    let [key, value] = entry;
                    headerNames.push(key)
                    tableSort.push(true)
                })
            }
    
            console.log(resp.data.list)
            resp.data.list.map((rowData) => {
                
                let row = new Array()
                let aTableFilter = new Object()
                let aTableSet = new Set()
                
                Object.entries(rowData).map((entry) => {
                    
                    let [key, value] = entry;
                    console.log(rowData)
    
                    row.push(value)
                    aTableFilter[value] = true
                    //tableSet.push( new Set([rowData]) )
                    //tableSearch.push("")
                })
                rows.push(row)
                tableFilter.push(aTableFilter)
                tableSet.push( new Set(row) )
                tableSearch.push("")
                
            })
    
            let selectAllList = []
            let selectAllListForFilter = {}
            headerNames.map((headerName, idx) =>{
                selectAllList.push("Select All " + headerName)
                selectAllListForFilter["Select All " + headerName] = true
            })
            rows.push(selectAllList)
            tableFilter.push(selectAllListForFilter)
            tableSet.push( new Set(["Set All"]) )
    
            console.log(rows, tableFilter, tableSet, tableSearch)
    
            setTable({
                head: headerNames,
                body: rows
            })
            setTableSort(tableSort)
            setDisplayTable(rows)
            setTableSet(tableSet)
            setTableFilter(tableFilter)
            setTableSearch(tableSearch)
            
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            let resp = await axios.get('get-school-students', {
              params: {
                currentPage: 1
              }
            })
            resp = resp.data
            console.log(resp.data, resp.data.pages)
    
            setPagination({
              currentPage: resp.data.currentPage,
              //arrayPage: 0,
              totalPages: resp.data.pages,
              tableSize: 20
          })
    
            let rows = []
            let tableFilter = []
            let tableSet = []
            let tableSearch =[]
            let headerNames = []
            let tableSort = []
    
            if (resp.data.list.length != 0) {
                Object.entries(resp.data.list?.[0]).map((entry) => {
                    let [key, value] = entry;
                    headerNames.push(key)
                    tableSort.push(true)
                })
            }
    
            console.log(resp.data.list)
            resp.data.list.map((rowData) => {
                
                let row = new Array()
                let aTableFilter = new Object()
                let aTableSet = new Set()
                
                Object.entries(rowData).map((entry) => {
                    
                    let [key, value] = entry;
                    console.log(rowData)
    
                    row.push(value)
                    aTableFilter[value] = true
                    //tableSet.push( new Set([rowData]) )
                    //tableSearch.push("")
                })
                rows.push(row)
                tableFilter.push(aTableFilter)
                tableSet.push( new Set(row) )
                tableSearch.push("")
                
            })
    
            let selectAllList = []
            let selectAllListForFilter = {}
            headerNames.map((headerName, idx) =>{
                selectAllList.push("Select All " + headerName)
                selectAllListForFilter["Select All " + headerName] = true
            })
            rows.push(selectAllList)
            tableFilter.push(selectAllListForFilter)
            tableSet.push( new Set(["Set All"]) )
    
            console.log(rows, tableFilter, tableSet, tableSearch)
    
            setTable({
                head: headerNames,
                body: rows
            })
            setTableSort(tableSort)
            setDisplayTable(rows)
            setTableSet(tableSet)
            setTableFilter(tableFilter)
            setTableSearch(tableSearch)
            
          } catch (error) {
            console.log(error)
          }
        }
        /*else {
            swal("Error",`enter a valid page number 1-${pagination.totalPages}`,"error", {
                buttons: false,
                timer: 2000
            })
        }*/
        
    }
    // PAGINATION END

    useEffect(() => { //tableSearch

        console.log("USE EFFECT CALLED FOR TABLE SEARCH CHANGE", table, displayTable)
        let updatedDisplay = []
        
        for(let rowIdx = 0; rowIdx < table.body.length-1; rowIdx++) {
            let row = table.body[rowIdx]
        
            /* NOT DYNAMIC
            if  ( 
                    (row[0]+"").search(tableSearch[0]) != -1 && (row[1]+"").search(tableSearch[1]) != -1 && (row[2]+"").search(tableSearch[2]) != -1 && (row[3]+"").search(tableSearch[3]) != -1 && (row[4]+"").search(tableSearch[4]) != -1 &&
                    tableSet[rowIdx].has(row[0]) && tableSet[rowIdx].has(row[1]) && tableSet[rowIdx].has(row[2]) && tableSet[rowIdx].has(row[3]) && tableSet[rowIdx].has(row[4]) 
                ) {
                updatedDisplay.push(row)
            }*/

            
            let addRow = true
            for(let idx = 0; idx < row.length; idx++) {
                let col = row[idx]
                console.log(row, col, (row[idx]+"").search(tableSearch[idx]) == -1, !tableSet[rowIdx].has(row[idx]), tableSet[rowIdx])
                if ((row[idx]+"").search(tableSearch[idx]) == -1 || !tableSet[rowIdx].has(row[idx]) ) {
                    addRow = false
                    console.log("false")
                    break;
                }
            }

            if  ( addRow ) {
                console.log("ROW ADDED")
                updatedDisplay.push(row)
            }
            /*let addToDisplay = false;
            table.body.head((headerName, idx) => {
                if row[rowIdx]
            })*/

        }

        setDisplayTable(
            updatedDisplay
        )

        //update Pagination
        //let totalPage = totalPageCalculate(updatedDisplay.length); 
        //console.log("total page", totalPage)
        /*setPagination({
            ...pagination,
            totalPages: totalPage,
            currentPage: 1
        })*/
        
    }, [tableSearch, tableFilter])

    useEffect(() => {

        if (props.tableName == "primarySkills" || props.tableName == "projects") {
            saveButtonDisabled();
        }
        setTimeout(() => {
          setLoading(false);
        },3000)
        
        
    }, [table])

    useEffect(() => {
      console.log("ONLY ONCE")
      const getTableData = async () => {
        if (props?.tableName) {
            console.log("prop for table name is: " + props.tableName)
            switch(props.tableName) {
              case "current connections":
                try {
                  let resp = await axios.get('get-school-students')
                  resp = resp.data
                  console.log(resp.data, resp.data.pages)

                  setPagination({
                    currentPage: resp.data.currentPage,
                    //arrayPage: 0,
                    totalPages: resp.data.pages,
                    tableSize: 20
                })

                  let rows = []
                  let tableFilter = []
                  let tableSet = []
                  let tableSearch =[]
                  let headerNames = []
                  let tableSort = []

                  if (resp.data.list.length != 0) {
                      Object.entries(resp.data.list?.[0]).map((entry) => {
                          let [key, value] = entry;
                          headerNames.push(key)
                          tableSort.push(true)
                      })
                  }

                  console.log(resp.data.list)
                  resp.data.list.map((rowData) => {
                      
                      let row = new Array()
                      let aTableFilter = new Object()
                      let aTableSet = new Set()
                      
                      Object.entries(rowData).map((entry) => {
                          
                          let [key, value] = entry;
                          console.log(rowData)

                          row.push(value)
                          aTableFilter[value] = true
                          //tableSet.push( new Set([rowData]) )
                          //tableSearch.push("")
                      })
                      rows.push(row)
                      tableFilter.push(aTableFilter)
                      tableSet.push( new Set(row) )
                      tableSearch.push("")
                      
                  })

                  let selectAllList = []
                  let selectAllListForFilter = {}
                  headerNames.map((headerName, idx) =>{
                      selectAllList.push("Select All " + headerName)
                      selectAllListForFilter["Select All " + headerName] = true
                  })
                  rows.push(selectAllList)
                  tableFilter.push(selectAllListForFilter)
                  tableSet.push( new Set(["Set All"]) )

                  console.log(rows, tableFilter, tableSet, tableSearch)

                  setTable({
                      head: headerNames,
                      body: rows
                  })
                  setTableSort(tableSort)
                  setDisplayTable(rows)
                  setTableSet(tableSet)
                  setTableFilter(tableFilter)
                  setTableSearch(tableSearch)
                  
                } catch (error) {
                  console.log(error)
                }
                break;
            }

        } else {
            console.log("prop doesn't exist")
            setTable({
              head: [],
              body: []
            })
        }
      }

      setEditMode(props.editMode)
      console.log(editMode)
      getTableData()

    }, [])

    useEffect(() => {
        if (props.excelData == null) {return }
        console.log(props.excelData)
        
        setEditMode(props.editMode)
        console.log(props.editMode)

        let rows = []
        let tableFilter = []
        let tableSet = []
        let tableSearch = []
        let headerNames = []
        let tableSort = []

        if (props.excelData.length != 0) {
            Object.entries(props.excelData?.[0]).map((entry) => {
                let [key, value] = entry;
                headerNames.push(key)
                tableSort.push(true)
            })
        } else {
            if(props.tableName === "podHistory"){
                headerNames = ["Pod Name", "Client Name", "Start Date", "End Date"]
                }
            else{
                headerNames = ["Task ID", "AcCount", "Team Assigned", "Task Descripton", "Deadline", "Pending With", "Status"]
                }
        }

        props.excelData.map((rowData) => {

            let row = new Array()
            let aTableFilter = new Object()
            let aTableSet = new Set()

            Object.entries(rowData).map((entry) => {

                let [key, value] = entry;
                //console.log(key)

                row.push(value)
                aTableFilter[value] = true
                //tableSet.push( new Set([rowData]) )
                //tableSearch.push("")
            })
            rows.push(row)
            tableFilter.push(aTableFilter)
            tableSet.push( new Set(row) )
            tableSearch.push("")

    })

    let selectAllList = []
    let selectAllListForFilter = {}
    headerNames.map((headerName, idx) =>{
        selectAllList.push("Select All " + headerName)
        selectAllListForFilter["Select All " + headerName] = true
    })
    rows.push(selectAllList)
    tableFilter.push(selectAllListForFilter)
    tableSet.push( new Set(["Set All"]) )

    console.log(rows, tableFilter, tableSet, tableSearch)

    setTable({
        head: headerNames,
        body: rows
    })
    setTableSort(tableSort)
    setDisplayTable(rows)
    setTableSet(tableSet)
    setTableFilter(tableFilter)
    setTableSearch(tableSearch)
    }, [props.excelData])

    const handleChangeForTableSearch = (colIdx) => (e) => { // Make backend API
        console.log("tableSearch")
        const {value} = e.target;
        let copyOfTableSearch = [...tableSearch]

        copyOfTableSearch[colIdx] = value
        setTableSearch(copyOfTableSearch)

        // update pagination
               
        
    }

    const toggleTableFilter = (rowIdx, colValue) => { // Make backend API
        console.log("tableFilter", tableFilter, tableFilter.length)
        
        if(rowIdx == tableFilter.length-1) {
            console.log("Select All")
            //SELECT ALL
            let copyFilter = [...tableFilter]
            

            if (copyFilter[rowIdx][colValue]) {

                // True to false
                let excludeSelectAllRow = 1
                copyFilter[rowIdx][colValue] = !copyFilter[rowIdx][colValue]
                
                let colIdx = table.body[rowIdx].indexOf(colValue)
                for(let row = 0; row < tableFilter.length-excludeSelectAllRow; row++) {
                    let rowSpecificColVal = table.body[row][colIdx]
                    copyFilter[row][rowSpecificColVal] = false
                    tableSet[row].delete(table.body[row][colIdx]); // not sure
                }
    
                
                
            } else {
                // False to true
                let excludeSelectAllRow = 1
                copyFilter[rowIdx][colValue] = !copyFilter[rowIdx][colValue]
    
                /*let rowIdxs = [0,1,2,3,4]
                let arrayOfColNames = []
                for(let row = 0; row < tableFilter.length-excludeSelectAllRow; row++) {
                    let arrayOfColNames = []
                }*/
    
                let colIdx = table.body[rowIdx].indexOf(colValue)
                for(let row = 0; row < tableFilter.length-excludeSelectAllRow; row++) {
                    let rowSpecificColVal = table.body[row][colIdx]
                    copyFilter[row][rowSpecificColVal] = true
                    tableSet[row].add(table.body[row][colIdx]);
                }
    
                //tableSet[colIdx] = new Set(this.table.body[colIdx]);
            }
            
            setTableFilter(copyFilter)//this.setState({tableFilter: copyFilter})
        } else {
            let copyFilter = [...tableFilter]
            console.log(copyFilter)
            copyFilter[rowIdx][colValue] = !copyFilter[rowIdx][colValue]
            let colIdx = table.body[rowIdx].indexOf(colValue)

            console.log(colIdx, colValue, table.body[rowIdx])
            if (copyFilter[rowIdx][colValue]) {
                //if true add to set
                tableSet[rowIdx].add(table.body[rowIdx][colIdx])
            } else {
                //if false remove from set
                tableSet[rowIdx].delete(table.body[rowIdx][colIdx])
            }
            setTableFilter(copyFilter)//this.setState({tableFilter: copyFilter})
        }
        console.log(tableSet)
    } 

    const sort = (index, colName) => { // Make this a backend api call;
        console.log(`sort called. current selectedColumn: ${selectedColumn} Index: ${index} and colName: ${colName}`)

        const sort = [...tableSort]

        if (colName === selectedColumn) {
            sort[index] = !sort[index]
        }
        
          const order = sort[index] === true ? "ASC" : "DESC"
        console.log(order)

          let sorted
          if (order === "ASC") {
            sorted = [...displayTable].sort((a, b) =>
              a[colName] > b[colName] ? 1 : -1
            );
          } else {
            sorted = [...displayTable].sort((a, b) =>
              a[colName] < b[colName] ? 1 : -1
            );
          }
    
          console.log(tableSort, sort)
          setTableSort(sort)
          setDisplayTable(sorted)
          setSelectedColumn(colName)
          //this.setState({ ...this.state, keyList: sort, displayList: sorted })
          return
        
    
        //console.log("sort")
        //const order = sort[index] === true ? "ASC" : "DESC"
        //this.setState({ ...this.state, keyList: sort, workExperienceReport: { ...workExperienceReport, colName: colName, order: order } }, () => {
        //  this.loadworkExperienceReport()
        //})
    
    }


    /* TABLES */

    // Employee View Task Start
    function ViewTaskTable() {
        console.log("list Pod Table called")
        return (
            <>
                {table.body.length != 1 ?
                    <>
                    <thead className={styleTest.excelThead}>
                        <tr className={styleTest.excelTr}>
                            {table.head.map((colName, colIndex) => {

                                return (
                                    colName === "delayReason" || colName === "isLate" || colName === "link" ? null:
                                    <th key={colIndex} className={styleTest.head}>
                                        {colName}
                                        <FontAwesomeIcon
                                            onClick={() => sort(table.head.indexOf(colName), colName)}
                                            icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                        </FontAwesomeIcon>

                                        <div className={styleTest.filter}>
                                            <Container className={styleTest.filterMenu}>
                                                {
                                                    table.body.map((row, rowIndex) => {
                                                        return (
                                                            <Row key={rowIndex}>
                                                                <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col>
                                                                <Col style={{border: "solid"}}>{row[colIndex]}</Col>
                                                            </Row>
                                                        )
                                                    })
                                                }

                                                <Row>
                                                    <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                    </th>
                                )
                            })}


                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayTable.slice((pagination.arrayPage *
                            pagination.tableSize), ((pagination.arrayPage + 1) *
                            pagination.tableSize)).map((row, rowIdx) => {
                                //console.log(tableFilter[rowIdx])
                                //console.log(row, tableSet[rowIdx].has(row[0]))
                                //console.log(rowIdx+1, (rowIdx+1) % 2)
                                //console.log(table.body, row[0], tableSearch[0], (row[0]+"").search(tableSearch[0]) != -1)
                                return (

                                    <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                        {

                                            table.head.map((colName, colIdx) => {


                                                return(
                                                    colName === "delayReason" || colName === "isLate" || colName === "link" ? null :
                                                    colName === "status" ?
                                                        <td>
                                                            <select type="text" name='status' value={row[colIdx]} onChange={() => console.log("ok")} style={{width: "100%"}} disabled={row[colIdx] === "COMPLETE"} >
                                                                <option value="ASSIGNED" disabled>Assigned</option>
                                                                <option value="INPROGRESS">In Progress</option>
                                                                <option value="COMPLETE">Complete</option>
                                                            </select>
                                                        </td>
                                                        :
                                                        <td>
                                                            { colName === "taskDescription" ?
                                                                <a href={row[7]} target="_blank" rel="noopener noreferrer"><div className={styleTest.excelTd}> {row[colIdx]} </div></a>
                                                                :
                                                                <div className={styleTest.excelTd}> {row[colIdx]} </div>
                                                            }
                                                        </td>
                                                    )

                                            })

                                        }

                                    </tr>

                                )
                            })
                        }

                    </tbody>
                    </>
                    :
                    <Container fluid style={{ border: "0px solid green", display: "flex", justifyContent: "center"}}>
                        <label style = {{border: " 0px solid"}}> no data present</label>
                    </Container>
                }
            </>
        )
    }


    // Employee View Task End

    // Start of DefaultTable used for: general tables, generate report tables, etc
    function DefaultTable() {
        console.log("list Pod Table called")
        return (
            <>
            { table.body.length != 0 ?
            <>
                <thead className={styleTest.excelThead}>
                    <tr className={styleTest.excelTr}>
                        {table.head.map((colName, colIndex) => {
                            
                            return (
                                colName == "catalog_listId" || colName == "catalogList" || colName == "deploymentStatus" || colName == "clientPodName" || colName == "workExperienceDTO" || colName == "userDTO" || colName == "leavePlanDTOs" || colName == "trainingCertificationDTO" 
                                || colName == "podHistId" || colName == "employeeId"?
                                null
                                :
                                <th key={colIndex} className={styleTest.head}> 
                                    {convertTableHeader(colName)}
                                    <FontAwesomeIcon 
                                        onClick={() => sort(table.head.indexOf(colName), colName)} 
                                        icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                    </FontAwesomeIcon>

                                    <div className={styleTest.filter}>
                                        <Container className={styleTest.filterMenu}>
                                            {
                                                table.body.map((row, rowIndex) => {
                                                    return (
                                                        <Row key={rowIndex}>
                                                            <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col> 
                                                            <Col style={{border: "solid", overflow: "auto"}}>{row[colIndex]}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            
                                            <Row>
                                                <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                            </Row>
                                        </Container>
                                    </div> 
                                </th>
                            )
                        })}
                        

                    </tr>
                </thead>
                <tbody>
                    {
                        displayTable.map((row, rowIdx) => {
                            //console.log(tableFilter[rowIdx])
                            //console.log(row, tableSet[rowIdx].has(row[0]))
                            //console.log(rowIdx+1, (rowIdx+1) % 2)
                            //console.log(table.body, row[0], tableSearch[0], (row[0]+"").search(tableSearch[0]) != -1)
                            return (

                                /*<tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    <td> <div className={styleTest.excelTd}> {row[0]} </div> </td>
                                    <td> <div className={styleTest.excelTd}> {row[1]} </div> </td>
                                    <td> <div className={styleTest.excelTd}> {row[2]} </div> </td>
                                    <td> <div className={styleTest.excelTd}> {row[3]} </div> </td>
                                    <td> <div className={styleTest.excelTd}> {row[4]}</div> </td>
                                </tr>*/

                                <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    {
                                        
                                        table.head.map((colName, colIdx) => {
                                            return(
                                                colName == "catalog_listId" || colName == "catalogList" || colName == "deploymentStatus" || colName == "clientPodName" || colName == "workExperienceDTO" || colName == "userDTO" || colName == "leavePlanDTOs" || colName == "trainingCertificationDTO" ||colName == "podHistId"|| colName == "employeeId" ?
                                                    null
                                                    :
                                                    <td> <div className={styleTest.excelTd}> {row[colIdx]} </div> </td>
                                            )
                                        })
                                        
                                    }
                                    
                                </tr>

                            )
                        })
                    }
                    
                </tbody>
            </>
            :
            <Container fluid style={{ border: "0px solid green", display: "flex", justifyContent: "center"}}>
                <label style = {{border: " 0px solid"}}> no data present</label>
            </Container>
                }
                </>
        )
    }

    let convertTableHeader = (headerName) => {

        let converter = {
            employeeId: "Employee ID",
            employeeName: "Name",
            employeeInfosysEmail: "Infosys Email",
            employeePhone: "Phone",
            employeeJobLevel: "Job Level",
            employeeInfosysJoiningDate: "Infosys Joining Date",
            currentLocation: "Current Location",
            employeeStatus: "Status",
            employeeInfosysTitle: "Infosys Title",
            employeeProjectTitle: "Project Title",
            totalYearsOfExperience: "Total Years Exp",
            totalYearsOfExperienceInInfosys: "Total Years Exp (Inside Infosys)",
            totalYearsOfExperienceOutsideInfosys: "Total Years Exp (Outside Infosys)",
            primarySkills: "Primary Skills",
            projectDTOList: "Projects",
            trainingFilter: "Access Level",
            trainingName: "Certification",
            trainingType: "Type",
            trainingLink: "Link",
            training_Status: "Status",
            clientName: "Client Name",
            podName: 'Pod Name',
            startDate: 'Start Date',
            endDate: "End Date",

        }

        return converter?.[headerName] ? converter[headerName] : headerName

    }
    // End of DefaultTable

    ///

   
    ///

    // Employee Search Table Start
    function employeeSearchTable() {
            console.log("list Pod Table called")
            return (
                <>
                    <thead className={styleTest.excelThead}>
                        <tr className={styleTest.excelTr}>
                            {table.head.map((colName, colIndex) => {

                                return (
                                    colName == "key" ?
                                        null
                                        :
                                    <th key={colIndex} className={styleTest.head}>
                                        {colName}
                                        <FontAwesomeIcon
                                            onClick={() => sort(table.head.indexOf(colName), colName)}
                                            icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                        </FontAwesomeIcon>
                                        <div className={styleTest.filter}>
                                            <Container className={styleTest.filterMenu}>
                                                {
                                                    table.body.map((row, rowIndex) => {
                                                        //console.log(row[colIndex], tableFilter)
                                                        return (
                                                            <Row key={rowIndex}>
                                                                <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col>
                                                                <Col style={{border: "solid"}}>{row[colIndex]}</Col>
                                                            </Row>
                                                        )
                                                    })
                                                }

                                                <Row>
                                                    <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                    </th>
                                )
                            })}

                            <th className={styleTest.head}>

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayTable.slice(((pagination.currentPage - 1) *
                            pagination.tableSize), (pagination.currentPage *
                            pagination.tableSize)).map((row, rowIdx) => {
                                //console.log(tableFilter[rowIdx])
                                //console.log(row, tableSet[rowIdx].has(row[0]))
                                //console.log(rowIdx+1, (rowIdx+1) % 2)
                                //console.log(table.body, row[0], tableSearch[0], (row[0]+"").search(tableSearch[0]) != -1)
                                return (
                                    <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                        {

                                            table.head.map((colName, colIdx) => {
                                                return(
                                                    colName == "key" ?
                                                    null
                                                    :
                                                    <>
                                                        <td> <div className={styleTest.excelTd}> {row[colIdx]} </div> </td>
                                                    </>
                                                )
                                            })

                                        }
                                        <td> <Button style={{width: "100%"}} onClick={() => props.viewEmployee(row[2])}>View</Button> </td>
                                    </tr>

                                )
                            })
                        }


                    </tbody>
                </>
            )
    }
    // Employee Search Table End

    // Pod Member Table Start 

    let generateTdForEmployeeSearchTable = (colName, colIdx, dataObj ) => {

        if (colName === "Status" && editMode) {
            return (
                <td> 
                    <div className={styleTest.excelTd} class="d-flex align-items-center justify-content-center container"> 
                        <select value={dataObj[colIdx]} style={{height: "100%"}} onChange={props.changeStatus(dataObj[0])}>
                            <option hidden>--select--</option>
                            <option value="Deployed">Deployed</option>
                            <option value="In training">In Training</option>
                            <option value="Ready for deployment">Ready for Deployment</option>
                        </select>
                    </div> 
                </td>)
        } else if (colName === "Project Title" && editMode) {
            return (
                <td> 
                    <div className={styleTest.excelTd} class="d-flex align-items-center justify-content-center container"> 
                        <select value={dataObj[colIdx]} style={{height: "100%"}} onChange={props.changeProjectTitle(dataObj[0])}>
                            <option hidden>--select--</option>
                            <option value="PROJECT_MANAGER">Project Manager</option>
                            <option value="SCRUM_MASTER">Scrum Master</option>
                            <option value="ARCHITECT">Architect</option>
                            <option value="BUSINESS_ANALYST">Business Analyst</option>
                            <option value="DEVELOPER">Developer</option>
                            <option value="QA">QA</option>
                        </select>
                    </div> 
                </td>)
        } else {
            return <td> <div className={styleTest.excelTd} class="d-flex align-items-center justify-content-center container"> {dataObj[colIdx]} </div> </td>
        }

    }

    function podMemberTable() {
        console.log("list Pod Table called")
        return (
            <>
                <thead className={styleTest.excelThead}>
                    <tr className={styleTest.excelTr}>
                        {editMode ? <th className={styleTest.head}> Delete </th> : null}
                        
                        {table.head.map((colName, colIndex) => {
                            
                            return (
                                
                                <th key={colIndex} className={styleTest.head}> 
                                    {colName}
                                    <FontAwesomeIcon 
                                        onClick={() => sort(table.head.indexOf(colName), colName)} 
                                        icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                    </FontAwesomeIcon>

                                    <div className={styleTest.filter}>
                                        <Container className={styleTest.filterMenu}>
                                            {
                                                table.body.map((row, rowIndex) => {
                                                    return (
                                                        <Row key={rowIndex}>
                                                            <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col> 
                                                            <Col style={{border: "solid", overflow: "auto"}}>{row[colIndex]}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            
                                            <Row>
                                                <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                            </Row>
                                        </Container>
                                    </div> 
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayTable.map((row, rowIdx) => {
                            
                            return (

                                <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    {editMode ? <td> <div className={styleTest.excelTd}> <input type="checkbox" onClick={props.addEmployeeToDeleteEmployeeList(row[0])} /> </div> </td> : null}
                                    {
                                        
                                        table.head.map((colName, colIdx) => {
                                            return( generateTdForEmployeeSearchTable(colName, colIdx, row) )
                                        })
                                        
                                    }
                                    
                                </tr>

                            )
                        })
                    }
                    
                </tbody>
            </>
        )
    }
    // Pod Member Table End

    // Assign Task Table Start

    let generateTdForAssignTaskTable = (colName, colIdx, dataObj ) => {
       
        let taskId = dataObj[0]
        console.log(dataObj, colName)

        if (colName === "taskDescription" && editMode) {
            let link = dataObj[7]

            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input name={'taskDescription'} value={dataObj[colIdx]} onChange={(e) => props.handleChange(taskId, e)}/> 
                        <Button title="Link" variant="outline-secondary" style={{ border: "solid" }} onClick={() => props.showLink(taskId)}>
                            <FontAwesomeIcon icon={faLink} />
                        </Button>
                    </div> 
                    
                </td>)
        } else if (colName === "deadline" && editMode) {
            return <td> <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> <input name='deadline' type="date" value={dataObj[colIdx]} onChange={(e) => props.handleChange(taskId, e)}/> </div> </td>
        } else if (colName === "status" && editMode) {
            return (
                    <td> 
                        <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container" > 
                            <select name="status" value={dataObj[colIdx]} disabled={dataObj[colIdx] == "OPEN"} style={{height: "100%"}} >
                                <option hidden>--select--</option>
                                <option value="OPEN">Open</option>
                                <option value="CLOSE">Closed</option>
                            </select>
                        </div>
                    </td>
            )
        } else if (colName === "taskDescription" && !editMode) {
            let link = dataObj[7]

            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px", fontSize: "12px"}} class="d-flex align-items-center justify-content-center container"> 
                        {link != null && link != "" ?  <a target="_blank" href={dataObj[7]}> {dataObj[colIdx]} </a> : <>{dataObj[colIdx]}</> }
                    </div> 
                    
                </td>)
        } else if ( ((taskId == "" || taskId == null)) && colName === "account" && editMode) {
            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input name="account" list="accountNameDropdown" value={dataObj[colIdx]} onChange={(e) => props.handleChange(taskId, e)} /> 
                        <datalist id='accountNameDropdown'>
                            <option hidden value="">Search Account</option>
                            {props.listAccounts.map((account) => {
                                return (<option value={account}> {account}</option>)
                            })
                            }
                        </datalist>
                    </div> 
                </td>
            )
        } else if ( ((taskId == "" || taskId == null)) && colName === "teamAssigned" && editMode) {
            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                    {
                        /^(DEVELOPER|QA|PROJECT_MANAGER|BUSINESS_ANALYST|SCRUM_MASTER|ARCHITECT|Individual)$/.test(dataObj[colIdx]) ?
                        
                            <select
                                name='teamAssigned'
                                value={dataObj[colIdx]}
                                onChange={(e) => props.handleChange(taskId, e)}
                            >
                                <option value="DEVELOPER">Developers</option>
                                <option value='QA'>Testers</option>
                                <option value='PROJECT_MANAGER'>Project Manager</option>
                                <option value='BUSINESS_ANALYST'>Business Analyst</option>
                                <option value='SCRUM_MASTER'>Scrum Master</option>
                                <option value='ARCHITECT'>Architect</option>
                                <option value='Individual'>Individual</option>
                            </select>
                            :
                            <div onClick={()=>{
                                props.resetIndivual()
                            }}> {dataObj[colIdx]} </div>
                    }
                    </div> 
                </td>
            )
        } else if ( editMode && (taskId != "" && taskId != null) && (colName !== "account" && colName !== "teamAssigned" && colName !== "taskId" && colName !== "pendingWith") ) {
            return <td> <div className={styleTest.excelTd} style={{maxWidth: "300px"}} > <input value={dataObj[colIdx]}/> </div> </td>
        } else {
            return <td> <div className={styleTest.excelTd} style={{maxWidth: "300px", fontSize: "12px"}} class="d-flex align-items-center justify-content-center container" > {dataObj[colIdx]} </div> </td>
        }

    }

    function assignTaskTable() {
        console.log("list Pod Table called")
        return (
            <>
                <thead className={styleTest.excelThead}>
                    <tr className={styleTest.excelTr}>
                        {editMode ? <th className={styleTest.head}> Delete </th> : null}
                        
                        {table.head.map((colName, colIndex) => {
                            
                            return (
                                colName == "link" ?
                                null
                                :
                                <th key={colIndex} className={styleTest.head}> 
                                    {mapTableNameToProperTitle(colName)}
                                    <FontAwesomeIcon 
                                        onClick={() => sort(table.head.indexOf(colName), colName)} 
                                        icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                    </FontAwesomeIcon>

                                    <div className={styleTest.filter}>
                                        <Container className={styleTest.filterMenu}>
                                            {
                                                table.body.map((row, rowIndex) => {
                                                    return (
                                                        <Row key={rowIndex}>
                                                            <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col> 
                                                            <Col style={{border: "solid", overflow: "auto"}}>{row[colIndex]}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            
                                            <Row>
                                                <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                            </Row>
                                        </Container>
                                    </div> 
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayTable.slice((pagination.arrayPage *
                            pagination.tableSize), ((pagination.arrayPage + 1) *
                            pagination.tableSize)).map((row, rowIdx) => {
                            
                            return (
                                <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    {editMode ? <td> <div className={styleTest.excelTd}> <input type="checkbox" onClick={(e) => props.addEmployeeToDeleteEmployeeList(e,row[0])} /> </div> </td> : null}
                                    {
                                        
                                        table.head.map((colName, colIdx) => {
                                            return( colName == "link" ? null : generateTdForAssignTaskTable(colName, colIdx, row) )
                                        })
                                        
                                    }
                                    
                                </tr>

                            )
                        })
                    }
                    
                </tbody>
            </>
        )
    }

    // Assign Task Table End

    // Primary Skill Table Start

    

    let saveButtonDisabled = () => {
        let colFilled = false
        table.body.map(row => {
            for(let colIdx = 0; colIdx < row.length-1; colIdx++) {
                if (row[colIdx] == "") {colFilled = true; break;}
            }
        })
        console.log("colFilled:", colFilled ? "True" : "False")
        console.log("props",props)
        props.updateDisabled(colFilled)
        return colFilled
        
    }

    let generateTdForPrimarySkillTable = (colName, colIdx, dataObj ) => {
       
        let primarySkillsId = dataObj[0]
        //console.log(dataObj, colName)
        //console.log("td For PrimarySkills", editMode)

        if (colName === "taskDescription" && editMode) {
            let link = dataObj[7]

            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        
                    </div> 
                    
                </td>)
        } else if (colName === "totalYearsWorked" && editMode) {
            return ( //LINEAR SEARCH BAD O(n^2) Find better way to change index
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input name='totalYearsWorked' value={dataObj[colIdx]} onBlur={(e) => {if(e.target.value == "") {let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = 0; setTable({...table, body: update })}} } onChange={(e) => { let onlyNum = /^[0-9]{0,2}$/; if(!onlyNum.test(e.target.value)) {return} let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value; setTable({...table, body: update }); updateTableFilterAndSet(update);}}/> 
                    </div> 
                </td>
            )
        } else if (colName === "primarySkills" && editMode) {
            return (
                    <td> 
                        <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container" > 

                            <input value={dataObj[colIdx]} onChange={(e) => {let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value; setTable({...table, body: update }); setDisplayTable(update); updateTableFilterAndSet(update);
                                }} /*onChange={(e)=>{ let update = [...this.state.formData.empPrimarySkills]; update[key].primarySkills = e.target.value; this.setState({...this.state, formData: {...this.state.formData, empPrimarySkils: update} }) }}*/ placeholder = 'Select Skill' name ="skill" list="skillNameDropdown"/>
                            <datalist id ='skillNameDropdown'>
                                {props.primarySkillList.map((skill) => {
                                    return( <option value={skill}> {skill}</option>)
                                })}
                            </datalist>

                        </div>
                    </td>
            )
        } else {
            return <td> <div className={styleTest.excelTd} style={{maxWidth: "300px", fontSize: "12px"}} class="d-flex align-items-center justify-content-center container" > {dataObj[colIdx]} </div> </td>
        }

    }  

    function primaryTaskTable() {
        
        return (
            <>
                <thead className={styleTest.excelThead}>
                    <tr className={styleTest.excelTr}>
                        {editMode ? <th className={styleTest.head}> Delete </th> : null}
                        
                        {table.head.map((colName, colIndex) => {
                            
                            return (
                                <th key={colIndex} className={styleTest.head}> 
                                    {mapTableNameToProperTitle(colName)}
                                    {/*<FontAwesomeIcon 
                                        onClick={() => sort(table.head.indexOf(colName), colName)} 
                                        icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                     </FontAwesomeIcon>
                                    */}

                                    <div className={styleTest.filter}>
                                        {/*
                                        <Container className={styleTest.filterMenu}>
                                            {
                                                table.body.map((row, rowIndex) => {
                                                    return (
                                                        <Row key={rowIndex}>
                                                            <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col> 
                                                            <Col style={{border: "solid", overflow: "auto"}}>{row[colIndex]}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            
                                            <Row>
                                                <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                            </Row>
                                        </Container>
                                        */}
                                    </div> 
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayTable.slice((pagination.arrayPage *
                            pagination.tableSize), ((pagination.arrayPage + 1) *
                            pagination.tableSize)).map((row, rowIdx) => {
                            
                            return (
                                <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    {editMode ? <td> <div className={styleTest.excelTd} class="d-flex align-items-center justify-content-center container"> { !/^NA.*$/.test(row[0]) ? <input type="checkbox"  onChange={() => alterDeleteSet(!deleteList.has(row[0]), row[0]) } /> : null } </div> </td> : null}
                                    {
                                        
                                        table.head.map((colName, colIdx) => {
                                            return( generateTdForPrimarySkillTable(colName, colIdx, row) )
                                        })
                                        
                                    }
                                    
                                </tr>

                            )
                        })
                    }
                    
                </tbody>
            </>
        )
    }

    // Primary Skill Table End

    // Project Table Start

    let mapProjectTableColumnNameToProperColumnName = (colName) => {
        let mapping = {
            "projectId": "ID",
            "client": "Client",
            "projectName": "Project Name",
            "projectDescription": "Project Description",
            "projectRole": "Project Role", 
            "startDate": "Start Date",
            "endDate": "End Date",
            "technologyUsed": "Tech Stack"
        }

        return (mapping?.[colName] ? mapping[colName] : colName)
    }

    let generateTdForProjectTable = (colName, colIdx, dataObj ) => {
       
        let primarySkillsId = dataObj[0]
        console.log(dataObj, colName)

        if (colName !==  "startDate" && colName !== "endDate" && colName !== "projectId" && editMode) {
            if ((colName ===  "projectName" || colName === "client" || colName === "projectRole") && editMode) {
            return (
                 <td>
                     <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container">
                     {/*for the replace function in the next line DO NOT Erase the space after the a-z*/}
                         <input type="text" onClick={(e) => {if(e.target.value==='Client Name Here'||e.target.value==='Project Name Here'||e.target.value==='Project Role Here'){e.target.value = ''; return e.target.value;}}} maxLength={50} value={dataObj[colIdx]} onChange={(e) => { let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value.replace(/[^A-Za-z ]/g, '');  console.log("update = ", update); setTable({...table, body: update }); updateTableFilterAndSet(update);}}/>
                     </div>
                 </td>)
            } else if (colName ===  "projectDescription" && editMode) {
              return (
                   <td>
                       <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container">
                       {/*for the replace function in the next line DO NOT Erase the space after the 0-9*/}
                           <input type="text" maxLength={500} onClick={(e) => {if(e.target.value==='Project Description Here'){e.target.value = ''; return e.target.value;}}} value={dataObj[colIdx]} onChange={(e) => { let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value.replace(/[^A-Za-z0-9 ]/g, '');  console.log("update = ", update); setTable({...table, body: update }); updateTableFilterAndSet(update);}}/>
                       </div>
                   </td>)
            } else if (colName ===  "technologyUsed" && editMode) {
                return (
                     <td>
                         <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container">
                         {/*for the replace function in the next line DO NOT Erase the space after the 0-9*/}
                             <input type="text" maxLength={50} onClick={(e) => {if(e.target.value==='Tech Stack Here'){e.target.value = ''; return e.target.value;}}} value={dataObj[colIdx]} onChange={(e) => { let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value.replace(/[^A-Za-z0-9 ]/g, '');  console.log("update = ", update); setTable({...table, body: update }); updateTableFilterAndSet(update);}}/>
                         </div>
                     </td>)
            } else {
            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input value={dataObj[colIdx]} onChange={(e) => { let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value;  console.log("update = ", update); setTable({...table, body: update }); updateTableFilterAndSet(update); }}/>
                    </div> 
                </td>)
            }
        } else if((colName == "startDate" || colName == "endDate") && editMode) {
            return (
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input name='deadline' type="date" value={dataObj[colIdx]} onChange={(e) => { let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value;  console.log("update = ", update); setTable({...table, body: update }); updateTableFilterAndSet(update); }}/*onChange={(e) => props.handleChange(taskId, e)}*/ />
                    </div>
                </td>
            )
        } else if (colName === "totalYearsWorked" && editMode) {
            return ( //LINEAR SEARCH BAD O(n^2) Find better way to change index
                <td> 
                    <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container"> 
                        <input name='totalYearsWorked' value={dataObj[colIdx]} onBlur={(e) => {if(e.target.value == "") {let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = 0; setTable({...table, body: update })}} } onChange={(e) => { let onlyNum = /^[0-9]{0,2}$/; if(!onlyNum.test(e.target.value)) {return} let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value; setTable({...table, body: update }); updateTableFilterAndSet(update); }}/> 
                    </div> 
                </td>
            )
        } else if (colName === "primarySkills" && editMode) {
            return (
                    <td> 
                        <div className={styleTest.excelTd} style={{maxWidth: "300px"}} class="d-flex align-items-center justify-content-center container" > 

                            <input value={dataObj[colIdx]} onChange={(e) => {let update = [...table.body]; let index = table.body.findIndex( ps => {return ps[0] == primarySkillsId}); update[index][colIdx] = e.target.value; setTable({...table, body: update }); setDisplayTable(update); updateTableFilterAndSet(update);
                                }} /*onChange={(e)=>{ let update = [...this.state.formData.empPrimarySkills]; update[key].primarySkills = e.target.value; this.setState({...this.state, formData: {...this.state.formData, empPrimarySkils: update} }) }}*/ placeholder = 'Select Skill' name ="skill" list="skillNameDropdown"/>
                            <datalist id ='skillNameDropdown'>
                                {props.primarySkillList.map((skill) => {
                                    return( <option value={skill}> {skill}</option>)
                                })}
                            </datalist>

                        </div>
                    </td>
            )
        } else {
            return <td> <div className={styleTest.excelTd} style={{maxWidth: "300px", fontSize: "12px"}} class="d-flex align-items-center justify-content-center container" > {dataObj[colIdx]} </div> </td>
        }

    }

    function projectTable() {
        
        return (
            <>
                <thead className={styleTest.excelThead}>
                    <tr className={styleTest.excelTr}>
                        {editMode ? <th className={styleTest.head}> Delete </th> : null}
                        
                        {table.head.map((colName, colIndex) => {
                            
                            return (
                                <th key={colIndex} className={styleTest.head}> 
                                    {mapProjectTableColumnNameToProperColumnName(colName)}
                                    {/*<FontAwesomeIcon 
                                        onClick={() => sort(table.head.indexOf(colName), colName)} 
                                        icon={tableSort[table.head.indexOf(colName)] === true ? faSortUp : faSortDown}>
                                     </FontAwesomeIcon>
                                    */}

                                    <div className={styleTest.filter}>
                                        {/*
                                        <Container className={styleTest.filterMenu}>
                                            {
                                                table.body.map((row, rowIndex) => {
                                                    return (
                                                        <Row key={rowIndex}>
                                                            <Col md={2} style={{border: "solid"}}> <input type="checkbox" onClick={()=> { toggleTableFilter(rowIndex, row[colIndex]); console.log(tableFilter); }} checked={tableFilter[rowIndex]?.[row[colIndex]]}></input></Col> 
                                                            <Col style={{border: "solid", overflow: "auto"}}>{row[colIndex]}</Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                            
                                            <Row>
                                                <Col md={{offset: 2, span: 10}} style={{border: "solid"}}> <input style={{width: "100%"}} value={tableSearch[colIndex]} onChange={ handleChangeForTableSearch(colIndex)} /> </Col>
                                            </Row>
                                        </Container>
                                        */}
                                    </div> 
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayTable.slice((pagination.arrayPage *
                            pagination.tableSize), ((pagination.arrayPage + 1) *
                            pagination.tableSize)).map((row, rowIdx) => {
                            
                            return (
                                <tr key={rowIdx} className={(rowIdx+1) % 2 == 0 ? styleTest.even : styleTest.odd}>
                                    {editMode ? <td> <div className={styleTest.excelTd} class="d-flex align-items-center justify-content-center container"> { !/^NA.*$/.test(row[0]) ? <input type="checkbox"  onChange={() => alterDeleteSet(!deleteList.has(row[0]), row[0]) } /> : null} </div> </td> : null}
                                    {
                                        
                                        table.head.map((colName, colIdx) => {
                                            return( generateTdForProjectTable(colName, colIdx, row) )
                                        })
                                        
                                    }
                                    
                                </tr>

                            )
                        })
                    }
                    
                </tbody>
            </>
        )
    }

    // Project Table End

    /* END OF TABLES */

    let mapTableNameToProperTitle = (tableName) => {
        let mapping = {
            podMembers: "Pod Members",
            assignTask:"Assign Task",
            taskId: "Task ID",
            account: "Account",
            teamAssigned: "Team Assigned",
            taskDescription: "Task Description",
            deadline: "Deadline",
            pendingWith: "Pending With",
            status: "Status",
            primarySkillsId: "ID",
            primarySkills: "Primary Skill",
            totalYearsWorked: "Years of Exp"

        }

        return (mapping?.[tableName] ? mapping[tableName] : tableName)
    }

    return (
            <Container fluid style={{width: props.width + "%", height: props.height + "%"}}>
                {error ?
                  <Container fluid style= {{border: "solid", width: props.width + "%", height: 100 + "%", display: "flex", alignItems: "center"}}>
                    <h1 style={{margin: "auto"}}> Error <FontAwesomeIcon icon={faSpinner} className="fa-spin"/> </h1>
                  </Container>
                  :
                  <>
                  {loading && !error ?
                    <>
                      {props?.useTitle ? <div style={{fontSize: "36px", width: props.width+"%", textAlign: "center"}}>  {mapTableNameToProperTitle(props.tableName)} </div> : null}
                      <Container fluid style= {{border: "solid", width: props.width + "%", height: 100 + "%", display: "flex", alignItems: "center"}}>
                          <h1 style={{margin: "auto"}}> Loading <FontAwesomeIcon icon={faSpinner} className="fa-spin"/> </h1>
                      </Container>
                    </>
                    :
                    <>
                      {props?.useTitle ? <div style={{fontSize: "36px", width: props.width+"%", textAlign: "center"}}>  {mapTableNameToProperTitle(props.tableName)} </div> : null}
                      {console.log(table.body.length, table.body)}
                      <div className={pagination.totalPages == 1 ? styleTest.excelContainer : styleTest.excelContainerPagination} style={table.body.length == 1 ? {width: props.width + "%"/*, display: "flex", alignItems: "center"*/} : {width: props.width + "%"}}>
                          <table className={styleTest.excelSheet} style={{ background: "white" }}>
                              {props.tableName == "WorkExpReport" ? DefaultTable() : null}
                              {props.tableName == "employeeDetailReport" ? DefaultTable() : null /* NEED HELP TO FIND ACCEPTABLE FORMAT*/}
                              {props.tableName == "leavePlanReport" ? DefaultTable() : null}
                              {props.tableName == "trainningAndCertReport" ? DefaultTable() : null}
                              {props.tableName == "viewTask" ? ViewTaskTable() : null}
                              {props.tableName == "employeeSearch" ? employeeSearchTable() : null}
                              {props.tableName == "podMembers" ? podMemberTable() : null}
                              {props.tableName == "assignTask" ? assignTaskTable() : null}
                              {props.tableName == "primarySkills" ? primaryTaskTable() : null}
                              {props.tableName == "projects" ? projectTable() : null}
                              {props.tableName == "podHistory" ?  DefaultTable() : null}

                              {props.tableName == "current connections" ? DefaultTable() : null}
                              {props.tableName == null ? DefaultTable() : null}
                          </table>
                      </div>
                      <div></div>
                      <div hidden={pagination.totalPages == 1} style={(pagination.currentPage === 1 || pagination.currentPage === pagination.totalPages) ? { display: "flex", justifyContent: "flex-end", marginTop: "10px" } : { display: "flex", justifyContent: "flex-end" }}>

                          {/*
                          <Button className={PaginationStyle.previousAndNextButton} disabled={pagination.currentPage === 1} onMouseDown={(e) => e.preventDefault()} onClick={previousPage}>{"<"}</Button>

                          {pagination.currentPage > 2 ?
                              <Button className={PaginationStyle.buttonToLink} onMouseDown={(e) => e.preventDefault()} onClick={() => indexPage(pagination.currentPage - 2)}>
                                  {pagination.currentPage - 2}
                              </Button> : null
                          }

                          {pagination.currentPage !== 1 ?
                              <Button className={PaginationStyle.buttonToLink} onMouseDown={(e) => e.preventDefault()} onClick={() => indexPage(pagination.currentPage - 1)}>
                                  {pagination.currentPage - 1}
                              </Button> : null
                          }

                          <Button className={PaginationStyle.buttonToLinkCurrent} disabled={pagination.currentPage}>{pagination.currentPage}</Button>

                          {!(pagination.currentPage + 1 > pagination.totalPages) ?
                              <Button className={PaginationStyle.buttonToLink} onMouseDown={(e) => e.preventDefault()} onClick={() => indexPage(pagination.currentPage + 1)}>
                                  {pagination.currentPage + 1}
                              </Button> : null
                          }

                          {!(pagination.currentPage + 2 > pagination.totalPages) ?
                              <Button className={PaginationStyle.buttonToLink} onMouseDown={(e) => e.preventDefault()} onClick={() => indexPage(pagination.currentPage + 2)}>
                                  {pagination.currentPage + 2}
                              </Button> : null
                          }

                          <Button className={PaginationStyle.previousAndNextButton} onMouseDown={(e) => e.preventDefault()} disabled={pagination.currentPage === pagination.totalPages} onClick={()=>nextPage()}>{">"}</Button>
                          */}
                          <Container style={{minWidth: "100%"}}>
                              <Row>
                                  <Col md={{span: 2, offset: 3}} as={Button} disabled={pagination.currentPage == "1" || pagination.currentPage == ""} onClick={previousPage}>prev</Col>
                                  <Col md={{ span: 2}}>
                                      <input style={{border: "solid", backgroundColor: "white", width: "100%", textAlign: "center"}} 
                                          value={focusTableInput ? pagination.currentPage : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
                                          onClick={()=> setFocusTableInput(true) }  
                                          onBlur={(e)=> {  if(pagination.currentPage == 0) {setPagination({...pagination, currentPage: 1}); setFocusTableInput(false); } else { setFocusTableInput(false) } changePage() }}
                                          onChange={(e) => { 
                                            console.log(`Number: ${Number(e.target.value)}`);
                                            setPagination({...pagination, currentPage: isNaN(Number(e.target.value)) ? 1 : Number(e.target.value) } )
                                          }}
                                      ></input>
                                  </Col>
                                  <Col md={{span: 2}} as={Button} disabled={pagination.currentPage == pagination.totalPages} onClick={nextPage}>next</Col>
                              </Row>
                          </Container>
                      </div>

                    </>
                  }
                  </>
              }
            </Container>
        
        
        

    );
});

export default ExcelLikeTable;