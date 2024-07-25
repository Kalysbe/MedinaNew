export const holderFormConfig = [
    { key: "name", label: "ФИО", type: "", size: 4 },
    { key: "actual_address", label: "Адрес", type: "", size: 4 },
    { key: "phone_number", label: "Телефоны , факс", type: "", size: 4 },
    { key: "passport_type", label: "Серия паспорта", type: "", size: 4 },
    { key: "passport_number", label: "Номер паспорта", type: "", size: 4 },
    { key: "passport_agency", label: "Кем выдан", type: "", size: 4 },
    { key: "inn", label: "ИНН", type: "", size: 4 }
]

export const formConfig = [
    { key: "operation_id", label: "Операция", type: "list", option: 'typeOperations', size: 4, disabled: true },
    { key: "emission_id", label: "Эмиссия для передачи", type: "list", option: 'stocks', size: 4, disabled: false },
    { key: "is_exchange", label: "Вид сделки", type: "list", option: 'typesOrder', size: 4, disabled: false },
    { key: "emission", label: "Эмиссия", type: "text", size: 4, disabled: true },
    { key: "postal_address", label: "Вид акций", type: "text", size: 4, disabled: true },
    { key: "quantity", label: "Количество", type: "number", size: 4, disabled: false },
    { key: "amount", label: "Сумма сделки", type: "number", size: 4, disabled: false },
    { key: "is_family", label: "Признак родственника", type: "list", option: 'typesFamily', size: 4, disabled: false },
    { key: "id_number", label: "Документ", type: "text", size: 4, disabled: false },
    { key: "contract_date", label: "Дата операции", type: "date", size: 4, disabled: false },
];