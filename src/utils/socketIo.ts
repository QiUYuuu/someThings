
import socketio from 'socket.io-client'

export const sockerIo = {};
setup() {
	function socketUrl(){
	     let socketUrl = `https://xxx.com/naas`
	     if(process.env.NODE_ENV === 'development') {
	         socketUrl = `https://xxx.com/naas`
	     }else if(process.env.NODE_ENV === 'production'){
	         // socketUrl = `https://socket.uniner.com`
	         socketUrl = `https://socket-tst.uniner.com/naas`
	     }
	     return socketUrl
	 }

	// 连接服务器
	 const sockets= socketio.connect(socketUrl(), {
	     transports: ['websocket','xhr-polling','jsonp-polling'],
	     transportOptions: {
	         polling: {
	             extraHeaders: {
	                 authorization: 'Bearer ' + window.localStorage.token
	             }
	         }
	     }
	 })
	 const handleAction=()=>{
	 	//离开方法触发自定义事件，跟后端约定一致
		sockets.emit('leave', {
	       room: robotInfo.data.robotNo,
	       flow_id: flowId,
	       flowVersion
	    })
	    //开启长连接触发自定义事件，跟后端约定一致
	   sockets.emit('join', {
	       room: robotInfo.data.robotNo,
	       flow_id: flowId,
	       // flowVersion: workflowListChecked.data.flowVersion
	       flowVersion
	   })
	}
	
	//监听socket.io推送的数据，on监听的事件是后端自定义的事件
	const getData=()=>{
		sockets.on('connect', (data: any) => {
        })

        sockets.on('disconnect', (data: any) => {
        })

        sockets.on('reconnect', (data: any) => {
            console.log('reconnect');
            
        })

        sockets.on('room_response', (data: any) => {})

        sockets.on('start_task_response', (data: any) => {
            console.log(data)
        })
        sockets.on('start_task', (data: any) => {
            console.log(data)
        })

        sockets.on('cpu_response', async(data: any) => {
        })
	}
 }
