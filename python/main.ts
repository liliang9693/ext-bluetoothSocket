
//% color="#007ff5" iconWidth=50 iconHeight=40
namespace bluetoothSocket{



    //% block="启动蓝牙服务器" blockType="command"
    export function startBTServer(parameter: any, block: any) {

        Generator.addImport(`import bluetooth\nimport threading\nimport time\nimport os`)
        
        Generator.addDeclaration("serverdataver",`bt_recv_data=''`)
        Generator.addDeclaration("servergetdata",`def getData():
    global bt_recv_data
    data = bt_recv_data
    bt_recv_data=''
    return data

`)
        Generator.addDeclaration("serverloop",`def server_loop():
    global bt_recv_data
    os.system("sudo hciconfig hci0 piscan")
    os.system("cat /opt/bdaddr")

    server_sock=bluetooth.BluetoothSocket( bluetooth.RFCOMM )
    port = 1
    server_sock.bind(("", port))
    server_sock.listen(1)    
    while True:
        client_sock,address = server_sock.accept()
        print ("Accepted connection from ",address)
        while True:
            try:
                data = client_sock.recv(1024)
                #print ("received [%s]" % data)
                bt_recv_data = data.decode()
                #print(bt_recv_data)
            except Exception as e:
                print(e)
                break

        client_sock.close()
    server_sock.close()
`)
Generator.addCode(`threading.Thread(target=server_loop).start()`)
    }

    //% block="蓝牙服务器 缓存区有数据？" blockType="boolean"
    export function serverAvailable(parameter: any, block: any) {
        Generator.addCode(`(len(bt_recv_data)>0)`)


    }

    //% block="蓝牙服务器 取缓存数据后清空缓存" blockType="reporter"
    export function serverGetData(parameter: any, block: any) {
        Generator.addCode(`getData()`)
    }
    //% block="---"
    export function noteSep1() {

    }

    //% block="启动蓝牙客户端 连接服务器 地址[MAC]" blockType="command"
    //% MAC.shadow="string" MAC.defl="00:e0:4c:c7:da:7c"
    export function startBTClient(parameter: any, block: any) {
        let mac=parameter.MAC.code;
        let mac2=replaceQuotationMarks(mac)
        Generator.addImport(`import bluetooth`)
        Generator.addCode(`print("${mac2},connecting...")
client_sock=bluetooth.BluetoothSocket(bluetooth.RFCOMM )
client_sock.connect((${mac}, 1))
print("${mac2},connected!")
`)

    }


    //% block="蓝牙客户端，发送消息[DATA]" blockType="command"
    //% DATA.shadow="string" DATA.defl="hello"
    export function saveImage(parameter: any, block: any) {
        let data=parameter.DATA.code;

        Generator.addCode(`client_sock.send(${data})`)

 
    }

    //% block="关闭蓝牙客户端" blockType="command"
    export function clientClose(parameter: any, block: any) {
 
        Generator.addCode(`client_sock.close()`)

 
    } 


    function replaceQuotationMarks(str:string){
            str=str.replace(/"/g, ""); //去除所有引号
            return str
    }


    
}
