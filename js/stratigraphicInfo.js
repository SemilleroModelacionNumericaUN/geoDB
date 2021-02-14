var isStratum = sessionStorage.getItem('isStratum')

function get(object, key, default_value) {
    if (typeof object[key] == "undefined") {
        object[key] = default_value
    }
    return object
}

$(document).ready(function () {
    var stratObj
    var tableHeadObj

    if (isStratum == "true") { // En memoria queda guardado como "true" y no true

        var Obj = JSON.parse(sessionStorage.getItem('stratumObject'))

        // Setting page and div title
        var stratumName = Obj.text['ID_ESTRATO']

        const pageTitle = document.getElementById('pageTitle')
        pageTitle.textContent = `Estrato ${stratumName}`

        const stratumTitle = document.getElementById('stratumTitle')
        stratumTitle.textContent = `ID DEL ESTRATO: ${stratumName}`

        // Setting divs info
        const spanTableInfo = document.getElementById('spanTableInfo')
        spanTableInfo.textContent = `Info. general del estrato: ${stratumName}`

        const spanTable = document.getElementById('spanTable')
        spanTable.textContent = `Info. de muestras del estrato: ${stratumName}`

    } else { // Si no cumple isStratum significa que todo el sondeo fue solicitado

        var Obj = JSON.parse(sessionStorage.getItem('sondeoObject'))

        // Setting page and div title
        var sondeoName = Obj.text['title']

        const pageTitle = document.getElementById('pageTitle')
        pageTitle.textContent = `Sondeo ${sondeoName}`

        const stratumTitle = document.getElementById('stratumTitle')
        stratumTitle.textContent = `ID DE PERFORACION: ${sondeoName}`

        // Setting divs info
        const spanTableInfo = document.getElementById('spanTableInfo')
        spanTableInfo.textContent = `Info. general del sondeo: ${sondeoName}`

        const spanTable = document.getElementById('spanTable')
        spanTable.textContent = `Info. de muestras del sondeo: ${sondeoName}`
    }

    function getStratumGeneralInfo() {

        var info = Obj.text
        const divTableInfoText = document.getElementById('divTableInfoText')

        Object.keys(info).forEach(key => {
            if (key == 'MUESTRAS') {
                // do nothing
            } else {
                divTableInfoText.innerHTML += `
                    <p class="text-info" style="display: inline"> ${key}: </p>
                    <p style="display: inline">${info[key]}</p>
                    <br>
                `
            }
        })
    }

    getStratumGeneralInfo()


    function getStratumInfo() {

        stratObj = {}
        tableHeadObj = {}

        var muestras = Obj.text['MUESTRAS']
        const divTable = document.getElementById('divTable')

        var table = document.createElement('table')
        table.setAttribute('class', 'table table-striped table-bordered')
        table.setAttribute('style', 'width:100%')
        table.id = "stratumTable"

        var thead = document.createElement('thead')
        var tbody = document.createElement('tbody')
        var tr = document.createElement('tr')

        // Crea un objeto con todos los titulos disponibles
        Object.keys(muestras).forEach(key => {
            Object.keys(muestras[key]).forEach(tHead => {
                get(tableHeadObj, tHead, true)
            })
        })

        // Crea un elemento th para insertar en el titulo de la tabla
        Object.keys(tableHeadObj).forEach(header => {
            var th = document.createElement('th')
            th.textContent = header
            tr.appendChild(th)
        })
        thead.appendChild(tr)

        // Crea los elementos td y tr para adicionarlos al cuerpo de la tabla
        Object.keys(muestras).forEach(key => {
            var trBody = document.createElement('tr')
            Object.keys(tableHeadObj).forEach(header => {
                var td = document.createElement('td')
                td.textContent = Obj.text['MUESTRAS'][key][header]
                trBody.appendChild(td)
            })
            tbody.appendChild(trBody)
        })

        table.appendChild(thead)
        table.appendChild(tbody)
        divTable.appendChild(table)

    }

    getStratumInfo()


    function createTable(element) {
        // Setup - add a text input to each footer cell
        $(`#${element} thead tr`).clone(true).appendTo(`#${element} thead`);
        $(`#${element} thead tr:eq(1) th`).each(function (i) {
            var title = $(this).text();
            $(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

            $('input', this).on('keyup change', function () {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        });

        var table = $('#' + element).DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            // scrollY: window.innerHeight * .80,
            scrollY: '80vh',
            scrollX: true,
            scrollCollapse: true,
            lengthChange: true,
            pageLength: 50,
            buttons: ['copy', 'excel', 'csv', 'pdf', 'colvis'],
            language: {
                "processing": "Procesando...",
                "lengthMenu": "Mostrar _MENU_ registros",
                "zeroRecords": "No se encontraron resultados",
                "emptyTable": "Ningún dato disponible en esta tabla",
                "info": "Mostrando _START_ - _END_, de _TOTAL_ registros totales",
                "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                "search": "Buscar:",
                "infoThousands": ",",
                "loadingRecords": "Cargando...",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "aria": {
                    "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad",
                    "collection": "Colección",
                    "colvisRestore": "Restaurar visibilidad",
                    "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
                    "copySuccess": {
                        "1": "Copiada 1 fila al portapapeles",
                        "_": "Copiadas %d fila al portapapeles"
                    },
                    "copyTitle": "Copiar al portapapeles",
                    "csv": "CSV",
                    "excel": "Excel",
                    "pageLength": {
                        "-1": "Mostrar todas las filas",
                        "1": "Mostrar 1 fila",
                        "_": "Mostrar %d filas"
                    },
                    "pdf": "PDF",
                    "print": "Imprimir"
                },
                "autoFill": {
                    "cancel": "Cancelar",
                    "fill": "Rellene todas las celdas con <i>%d<\/i>",
                    "fillHorizontal": "Rellenar celdas horizontalmente",
                    "fillVertical": "Rellenar celdas verticalmentemente"
                },
                "decimal": ",",
                "searchBuilder": {
                    "add": "Añadir condición",
                    "button": {
                        "0": "Constructor de búsqueda",
                        "_": "Constructor de búsqueda (%d)"
                    },
                    "clearAll": "Borrar todo",
                    "condition": "Condición",
                    "conditions": {
                        "date": {
                            "after": "Despues",
                            "before": "Antes",
                            "between": "Entre",
                            "empty": "Vacío",
                            "equals": "Igual a",
                            "not": "No",
                            "notBetween": "No entre",
                            "notEmpty": "No Vacio"
                        },
                        "moment": {
                            "after": "Despues",
                            "before": "Antes",
                            "between": "Entre",
                            "empty": "Vacío",
                            "equals": "Igual a",
                            "not": "No",
                            "notBetween": "No entre",
                            "notEmpty": "No vacio"
                        },
                        "number": {
                            "between": "Entre",
                            "empty": "Vacio",
                            "equals": "Igual a",
                            "gt": "Mayor a",
                            "gte": "Mayor o igual a",
                            "lt": "Menor que",
                            "lte": "Menor o igual que",
                            "not": "No",
                            "notBetween": "No entre",
                            "notEmpty": "No vacío"
                        },
                        "string": {
                            "contains": "Contiene",
                            "empty": "Vacío",
                            "endsWith": "Termina en",
                            "equals": "Igual a",
                            "not": "No",
                            "notEmpty": "No Vacio",
                            "startsWith": "Empieza con"
                        }
                    },
                    "data": "Data",
                    "deleteTitle": "Eliminar regla de filtrado",
                    "leftTitle": "Criterios anulados",
                    "logicAnd": "Y",
                    "logicOr": "O",
                    "rightTitle": "Criterios de sangría",
                    "title": {
                        "0": "Constructor de búsqueda",
                        "_": "Constructor de búsqueda (%d)"
                    },
                    "value": "Valor"
                },
                "searchPanes": {
                    "clearMessage": "Borrar todo",
                    "collapse": {
                        "0": "Paneles de búsqueda",
                        "_": "Paneles de búsqueda (%d)"
                    },
                    "count": "{total}",
                    "countFiltered": "{shown} ({total})",
                    "emptyPanes": "Sin paneles de búsqueda",
                    "loadMessage": "Cargando paneles de búsqueda",
                    "title": "Filtros Activos - %d"
                },
                "select": {
                    "1": "%d fila seleccionada",
                    "_": "%d filas seleccionadas",
                    "cells": {
                        "1": "1 celda seleccionada",
                        "_": "$d celdas seleccionadas"
                    },
                    "columns": {
                        "1": "1 columna seleccionada",
                        "_": "%d columnas seleccionadas"
                    }
                },
                "thousands": "."
            }
        });

        table.buttons().container()
            .appendTo(`#${element}_wrapper .col-md-6:eq(0)`);
    }

    // Crea la tabla  
    createTable("stratumTable")
    createTable("example")


});