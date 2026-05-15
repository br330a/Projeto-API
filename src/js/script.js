//DECLARÇÕES DOS ELEMENTOS COM DOM
const videoElemento = document.getElementById("video");
const botaoScan = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//método: habilitar câmera

//async:(lida com tarefas demoradas): vc faz outras coisas enquanto ele trabalha com outra
async function configurarCamera() {
    //try: código que pode dar erro
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment"}, //habilitado camera traseira
        })

        //atribuir o fluxo da camera em midia
        videoElemento.srcObject = midia;

        //garante que a camera vai funcionar
        videoElemento.play();
    //executa apenas se houver erro no try
    }catch(erro){
        resultado.innerText = "Erro ao capturar a câmera", erro
    }
    
}

//executa a funcao da camera
configurarCamera();

//funcao para capturar o texto
botaoScan.onclick = async ()=>{
    botaoScan.disable = true; // habilita o botão pra pegar o texto
    resultado.innerText = "Fazendo a leitura... Aguarde";

    //prepara o canvas para receber a estrutura em 2d
    const contexto = canvas.getContext("2d");

    //ajusta o tamanho do canvas de acordo com o video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //define a matriz de trabsformação do canvas (escala, inclinação...)
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    //aplica o filtro de contraste para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    //Desenha p video no canvas
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height)

    try{
        //o tesseract retorna o objeto
        const{data: {text}} = await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        );
        const textoFinal = text.trim(); //remove todos os espaços em branco
        resultado.innerText= textoFinal.length > 0 ? textoFinal: "Não foi possivel identificar o texto"
        
    }catch(erro){
        resultado.innerText="erro ao processar a leitura", erro

    }finally{
        //desabilita a leitura do texto para começar novamente 
        botaoScan.disable=false;
    }
}