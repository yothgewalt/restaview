export function CharacterValidator(value: string) {
    if (value.length < 2) {
        return 'ชื่อจริงไม่ห้ามมีต่ำกว่า 2 ตัวอักษร'
    }

    if (/^[a-zA-Z]+$/.test(value) !== true) {
        return 'สามารถใช้ได้แค่ตัวอักษรภาษาอังกฤษเท่านั้น'
    }
}
