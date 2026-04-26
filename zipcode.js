$('#zipcode')
    .focusout(function(e){
        var zipcode = $('#zipcode').val();
        zipcode = zipcode.replace(/-/g, ''); //ハイフンを除去する

        //zipcodeに入力された値が７桁かどうかをチェック
        //正規表現を使って、zipcodeが7桁の数字でなかったらアラートを出してfalseを返す
        //また、zipcodeが7桁の数字でなかったら、nameがaddressのoptionを初期化し初期状態に戻す
        if(!zipcode.match(/^\d{7}$/)){
            alert('郵便番号は7桁の半角数字で入力してください。');
            $("[name=address]").children().remove();
            $("[name=address]").append('<option>郵便番号を入力してください</option>');
            return false;
        }

        //フォーマット統一のため、ハイフンを取り除いたzipcodeをnameがzipcodeのフォームに挿入する
        $("[name=zipcode]").val(zipcode);

        $.ajax({
            url: 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + zipcode,
            type: 'GET',
            dataType: 'jsonp',
            success: function(data) {

                //住所が見つかった場合の処理を記述
                //住所の配列はdata.resultsに格納されている
                if (data.results) {
                    var address = [];

                    //data.resultsの中身をループして、必要な住所情報を連結したものをaddressに住所を格納する
                    //address1は都道府県、address2は市区町村、address3は町域を表している
                    for(var i = 0; i < data.results.length; i++) {
                        address[i] = data.results[i].address1 + data.results[i].address2 + data.results[i].address3;
                        
                    }
                    //name=addressのopitionを初期化
                    $("[name=address]").children().remove();

                    //name=addressのoptionの値を追加する
                    //address配列の中身をループをしながらoptionのvalueとlabelをセットする
                    for(var i =0; i < address.length; i++) {
                        $("[name=address]").append($("<option>").text(address[i]).attr("value", address[i]));
                    }

                //住所が見つからなかった場合の処理を記述
                //nameがaddressのoptionを初期化し、初期状態に戻す
                } else {
                    alert('郵便番号に対応する住所が見つかりませんでした。');
                    $("[name=address]").children().remove();
                    $("[name=address]").append('<option>郵便番号を入力してください</option>');
                }
            },
            error: function() {
                alert('通信エラーが発生しました。');
            }
        });
    })