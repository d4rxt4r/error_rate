function init(n) {
	for (var i = 2; i <= n; i++) {
		$('<option value="'+i+'" data-count="'+i+'">'+i+'</option>').appendTo('#count');
		$('#count option:eq(3)').prop('selected', true);
	}
	
}

function draw() {
	var count = $('#count option:selected').val(),
	str = "this.value = this.value.replace(/[^0-9.]/g,\"\");", 
	str2 = "this.value = this.value.replace(/(\\..*)\\./g, \"$1\");",
	input = "<input class='sample' placeholder='0' type='text' oninput='" + str + str2 + "'>";
	$('#samples').empty();
	for (i = count;i > 0;i--) {
		$('#samples').append(input);
	}
}

function doMath(method) {

	var samples = [], round;
	$('.sample').each(function(i, el) {
		samples[i] = +$(this).val();
	});
	round = $('#round option:selected').val();

	switch (method) {
		case 'Корнфельд':

			var min, max, apr, da;

			max = Math.max.apply(null, samples);
			min = Math.min.apply(null, samples);
			apr = (max+min)/2;
			da = (max-min)/2;
			apr = apr.toFixed(round);
			da = da.toFixed(round);
			var kpr = MathJax.Hub.getAllJax("kpr")[0],
				kda = MathJax.Hub.getAllJax("kda")[0];
			MathJax.Hub.Queue(["Text",kpr,"<math><mfrac><mstyle><mi>" + max + "</mi><mo>+</mo><mi>"+min+"</mi></mstyle><mi>2</mi></mfrac><mo>=</mo><mi>"+apr+"</mi></math>"]);
			MathJax.Hub.Queue(["Text",kda,"<math><mfrac><mstyle><mi>" + max + "</mi><mo>-</mo><mi>"+min+"</mi></mstyle><mi>2</mi></mfrac><mo>=</mo><mi>"+da+"</mi></math>"]);

		break
		case 'Стьюдент':

			var length, sum = 0, msum = 0, apr, da, alpha, count, t, s;
			var p = [];
			p[0] = [6.31,2.92,2.35,2.13,2.02,1.94,1.89,1.86,1.83,1.81,1.80,1.78,1.77,1.76,1.75,1.75,1.74,1.73,1.73,1.72,1.72,1.72,1.71,1.71,1.71,1.71,1.70,1.70,1.70];
			p[1] = [12.71,4.30,3.18,2.78,2.57,2.45,2.36,2.31,2.26,2.23,2.20,2.18,2.16,2.14,2.13,2.12,2.11,2.10,2.09,2.09,2.08,2.07,2.07,2.06,2.06,2.06,2.05,2.05,2.05];
			p[2] = [63.66,9.92,5.84,4.60,4.03,3.71,3.50,3.36,3.25,3.17,3.11,3.05,3.01,2.98,2.95,2.92,2.90,2.88,2.86,2.85,2.83,2.82,2.81,2.80,2.79,2.78,2.77,2.76,2.76];
			alpha = $('#alpha option:selected').val();
			count = $('#count option:selected').data('count');
			length = samples.length;
			for (var i = 0; i < length; i++) {
				sum += samples[i];
			}
			apr = sum / length;
			t = p[alpha][count];
			for (i = 0; i < length; i++) {
				msum += Math.pow((apr - samples[i]), 2);
			}
			s = Math.sqrt(msum/(length*(length-1)));
			da = t*s;
			apr = apr.toFixed(round);
			da = da.toFixed(round);
			msum = msum.toFixed(round);
			s = s.toFixed(round);
			var aprM = MathJax.Hub.getAllJax("ansapr")[0],
			aprsM = MathJax.Hub.getAllJax("aprsum")[0],
			msumM =  MathJax.Hub.getAllJax("msum")[0],
			das = MathJax.Hub.getAllJax("das")[0],
			ansda = MathJax.Hub.getAllJax("ansda")[0],
			n = $('#count option:selected').val()*5,
			l = length*(length-1);
			sum = sum.toFixed(round);
			MathJax.Hub.Queue(["Text",aprsM,"<math><mi>" + sum + "</mi></math>"]);
			MathJax.Hub.Queue(["Text",aprM,"<math><mfrac><mi>" + sum + "</mi><mi>" + n + "</mi></mfrac><mo>=</mo><mi>" + apr + "</mi></math>"]);
			MathJax.Hub.Queue(["Text",msumM,"<math><mi>" + msum + "</mi></math>"]);
			MathJax.Hub.Queue(["Text",das,"<math><mfrac><mi>" + msum + "</mi><mi>" + l + "</mi></mfrac><mo>=</mo><mi>" + s +"</mi></math>"]);
			MathJax.Hub.Queue(["Text",ansda,"<math><mi>" + t + "</mi><mo>&#xD7;</mo><mi>" + s + "</mi><mo>=</mo><mi>" + da + "</mi></math>"]);

		break
	}
	
	$('#apr').text(apr);
	$('#da').text(da);
	$('.answer').show(400);
	$('.col2').show(400);
}

$(document).ready(function($) {
	init(30);
	draw();

	$('#count').change(function() {
		draw();
	});

	$('#method').change(function() {
		if ($(this).val() == 'Стьюдент') {
			$('.a').show();
			$('.kbox').hide();
			$('.sbox').show();
		} else {
			$('.a').hide();
			$('.sbox').hide();
			$('.kbox').attr('style', 'display:flex; font-size:22px');
		}
	});

	$('#solve').click(function() {
		m = $('#method option:selected').val();
		doMath(m);
	});
});