# How to use

## Run 
```shell
    $ npm install
    $ node sample_inquirer.js 

    ? What's your run files? (Use arrow keys)
    common
  > generator
    node_modules
    output
    reader
    sample_inquirer.js
```

*선택한 항목이 디렉토리의 경우 디렉토리에 속한 파일을 다시 출력*

> 선택한 파일을 실행을 위해 run-info.json에아래와 같은 형식으로 등록한다. 
>> key 값은 directory 또는 file명을 의미한다.  
>> value 값은 실행을 위한 paremter을 의미한다. 
```json
{
    "generator": {
        "index.js": {
            "-f": "file name",
            "-r": "total rows"
        },
        "generator-stream.js": {
            "-f": "file name",
            "-c": "cluster count"
        }
    }
}
```

`해당 내용을 등록 후 실행하였다면, 실행할 파일을 선택한 뒤 파라미터 입력을 위한 항목이 추가된다.`

```json
    ? What's your run files? generator
    ? What's your run files? index.js
    nowconfig : {"-f":"file name","-r":"total rows"}
    ? file name imsi.csv
    ? total rows 2000
```

**`현재는 일부 항목만 실행 가능함.. 수정 예정`**
