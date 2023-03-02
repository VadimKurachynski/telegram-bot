

exports.sutochnye=(body)=>{
    const{date,gas,shepaPrihod,shepaRashod,shepaOstatok,
        torfPrihod,torfRashod,torfOstatok,
        vyrabotka,sobstvennye,proizvodstvennye,otpuskvSet,
        Tnaruzn,Tprimoj,Tobratnoj,TprimNaGorod,Vpashod,
        Pkotla,Gpodpitka,NCC}=body.message;
    const srrashod=(+Vpashod/24).toFixed(0);
    const srpkotla=(+Pkotla/24).toFixed(1);

    return `
<b>СООБЩЕНИЕ ОТ ГЩУ</b>
Данные за:  ${date}
<pre>
Газ_м³:            ${gas}
Щепа_приход_т:     ${shepaPrihod}
Щепа_расход_т:     ${shepaRashod}
Щепа_остаток_т:    ${shepaOstatok}
*************************
Торф_приход_т:     ${torfPrihod}
Торф_расход_т:     ${torfRashod}
Торф_остаток_т:    ${torfOstatok}
*************************
Выработка_кВтч:    ${vyrabotka}
СН_кВтч:           ${sobstvennye}
Пр_н_кВтч:         ${proizvodstvennye}
Отпуск_кВтч:       ${otpuskvSet}
*************************
Тнар_возд_°C:      ${Tnaruzn}
Тпрям_°C:          ${Tprimoj}
Тобратн_°C:        ${Tobratnoj}
Тпрям_на_город_°C: ${TprimNaGorod}
Vрасход_м³/сут:    ${Vpashod}(${srrashod})
*************************
Pкотла_МВт:        ${Pkotla}(${srpkotla})
Gподп_ТС_м³/сут:   ${Gpodpitka}
НСС: ${NCC}
</pre>
<b>Доброго дня и хорошего настроения!</b>
`
};

exports.prostomessage=(body)=>{
    const{text,NCC}=body.message;

    return `
<b>🔥СООБЩЕНИЕ ОТ ГЩУ🔥</b>

${text}

<b>Доброго дня и хорошего настроения!😃</b>
`
};
