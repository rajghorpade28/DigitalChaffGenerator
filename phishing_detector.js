import { showWarningOverlay } from './warning_ui.js';

/**
 * Trained Random Forest Model Data (Version 2 - Path-Aware)
 * Features: url_length, hostname_length, dot_count, slash_count,
 *           subdomain_count, has_at, has_dash, digit_ratio,
 *           keyword_count, risky_tld, entropy
 */
const ML_MODEL = {
  "feature_names": [
    "url_length",
    "hostname_length",
    "dot_count",
    "slash_count",
    "subdomain_count",
    "has_at",
    "has_dash",
    "digit_ratio",
    "keyword_count",
    "risky_tld",
    "entropy"
  ],
  "n_trees": 10,
  "trees": [
    [
      {
        "left": 1,
        "right": 14,
        "feature": 10,
        "threshold": 4.529581785202026,
        "value": [
          0.9997000899730081,
          0.00029991002699190244
        ]
      },
      {
        "left": 2,
        "right": 13,
        "feature": 4,
        "threshold": 2.5,
        "value": [
          0.9997587834687937,
          0.0002412165312062951
        ]
      },
      {
        "left": 3,
        "right": 8,
        "feature": 10,
        "threshold": 4.390985727310181,
        "value": [
          0.9997675302210712,
          0.00023246977892873926
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9998036785880864,
          0.00019632141191358357
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 1,
        "threshold": 33.5,
        "value": [
          0.9998586908267837,
          0.00014130917321628433
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9998973318809551,
          0.00010266811904493609
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9682051282051282,
          0.031794871794871796
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 9,
        "right": 12,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9265822784810127,
          0.07341772151898734
        ]
      },
      {
        "left": 10,
        "right": 11,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9838709677419355,
          0.016129032258064516
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 15,
        "right": 18,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.6356589147286822,
          0.3643410852713178
        ]
      },
      {
        "left": 16,
        "right": 17,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.3333333333333333,
          0.6666666666666666
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 19,
        "right": 20,
        "feature": 7,
        "threshold": 0.08792270720005035,
        "value": [
          0.7272727272727273,
          0.2727272727272727
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 21,
        "right": 24,
        "feature": 0,
        "threshold": 69.5,
        "value": [
          0.8372093023255814,
          0.16279069767441862
        ]
      },
      {
        "left": 22,
        "right": 23,
        "feature": 1,
        "threshold": 21.5,
        "value": [
          0.9726027397260274,
          0.0273972602739726
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": 25,
        "right": 26,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.07692307692307693,
          0.9230769230769231
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.5,
          0.5
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 14,
        "feature": 7,
        "threshold": 0.21680375933647156,
        "value": [
          0.9997100869739078,
          0.00028991302609217236
        ]
      },
      {
        "left": 2,
        "right": 13,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9997605714026483,
          0.0002394285973516677
        ]
      },
      {
        "left": 3,
        "right": 8,
        "feature": 10,
        "threshold": 4.366110801696777,
        "value": [
          0.9998323879425178,
          0.00016761205748211402
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 2,
        "threshold": 4.0,
        "value": [
          0.9998638146769949,
          0.0001361853230051057
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.9998650754820715,
          0.0001349245179285682
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999271713783517,
          7.282862164830778e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9993040705545925,
          0.0006959294454074983
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 9,
        "right": 12,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9458874458874459,
          0.05411255411255411
        ]
      },
      {
        "left": 10,
        "right": 11,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.9931818181818182,
          0.006818181818181818
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.7857142857142857,
          0.21428571428571427
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 15,
        "right": 30,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9937163375224417,
          0.0062836624775583485
        ]
      },
      {
        "left": 16,
        "right": 23,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.998796992481203,
          0.0012030075187969924
        ]
      },
      {
        "left": 17,
        "right": 20,
        "feature": 1,
        "threshold": 6.0,
        "value": [
          0.9996959099893569,
          0.0003040900106431504
        ]
      },
      {
        "left": 18,
        "right": 19,
        "feature": 10,
        "threshold": 3.97282075881958,
        "value": [
          0.75,
          0.25
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 21,
        "right": 22,
        "feature": 1,
        "threshold": 12.5,
        "value": [
          0.9998478624676708,
          0.00015213753232922562
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9996402877697842,
          0.00035971223021582735
        ]
      },
      {
        "left": 24,
        "right": 27,
        "feature": 7,
        "threshold": 0.2886904776096344,
        "value": [
          0.9178082191780822,
          0.0821917808219178
        ]
      },
      {
        "left": 25,
        "right": 26,
        "feature": 10,
        "threshold": 4.205076456069946,
        "value": [
          0.9830508474576272,
          0.01694915254237288
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9285714285714286,
          0.07142857142857142
        ]
      },
      {
        "left": 28,
        "right": 29,
        "feature": 7,
        "threshold": 0.2980072349309921,
        "value": [
          0.6428571428571429,
          0.35714285714285715
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.8181818181818182,
          0.18181818181818182
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 16,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9996913425972208,
          0.00030865740277916624
        ]
      },
      {
        "left": 2,
        "right": 15,
        "feature": 2,
        "threshold": 3.5,
        "value": [
          0.999800038242686,
          0.00019996175731391372
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 1,
        "threshold": 33.5,
        "value": [
          0.999813783053508,
          0.00018621694649199766
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 1,
        "threshold": 27.5,
        "value": [
          0.9998598398670481,
          0.00014016013295189755
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9998930148784838,
          0.00010698512151621832
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999029149471895,
          9.708505281048619e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9942196531791907,
          0.005780346820809248
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 8,
        "threshold": 0.5,
        "value": [
          0.9941086624481781,
          0.005891337551821951
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9944933920704846,
          0.005506607929515419
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9534883720930233,
          0.046511627906976744
        ]
      },
      {
        "left": 11,
        "right": 12,
        "feature": 0,
        "threshold": 42.5,
        "value": [
          0.9649621212121212,
          0.035037878787878785
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 13,
        "right": 14,
        "feature": 10,
        "threshold": 4.001011610031128,
        "value": [
          0.9677113010446344,
          0.032288698955365625
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9623059866962306,
          0.037694013303769404
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 14,
        "feature": 2,
        "threshold": 3.5,
        "value": [
          0.9996763470958713,
          0.0003236529041287614
        ]
      },
      {
        "left": 2,
        "right": 13,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9996938364911913,
          0.00030616350880876154
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 1,
        "threshold": 71.0,
        "value": [
          0.9998312744652026,
          0.00016872553479745436
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 1,
        "threshold": 33.5,
        "value": [
          0.9998375223406781,
          0.00016247765932184325
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 1,
        "threshold": 28.5,
        "value": [
          0.9998873704760475,
          0.00011262952395254542
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999145710398337,
          8.542896016623471e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9928963513077171,
          0.007103648692282854
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 9,
        "threshold": 0.5,
        "value": [
          0.9611650485436893,
          0.038834951456310676
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.937791601866252,
          0.06220839813374806
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": 11,
        "right": 12,
        "feature": 10,
        "threshold": 4.788524389266968,
        "value": [
          0.16666666666666666,
          0.8333333333333334
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 12,
        "feature": 1,
        "threshold": 37.5,
        "value": [
          0.9996863440967709,
          0.0003136559032290313
        ]
      },
      {
        "left": 2,
        "right": 11,
        "feature": 0,
        "threshold": 47.0,
        "value": [
          0.999738702966534,
          0.00026129703346602386
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9998287037500125,
          0.0001712962499874966
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9998712097530478,
          0.00012879024695217254
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 0,
        "threshold": 42.5,
        "value": [
          0.9998910234650279,
          0.0001089765349720732
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999109915416892,
          8.900845831082004e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9757575757575757,
          0.024242424242424242
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 8,
        "threshold": 0.5,
        "value": [
          0.9886765746638358,
          0.01132342533616419
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9914833215046132,
          0.008516678495386799
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 13,
        "right": 14,
        "feature": 4,
        "threshold": 0.5,
        "value": [
          0.890625,
          0.109375
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": 15,
        "right": 22,
        "feature": 7,
        "threshold": 0.007042253389954567,
        "value": [
          0.25,
          0.75
        ]
      },
      {
        "left": 16,
        "right": 19,
        "feature": 1,
        "threshold": 43.0,
        "value": [
          0.5833333333333334,
          0.4166666666666667
        ]
      },
      {
        "left": 17,
        "right": 18,
        "feature": 10,
        "threshold": 4.070590496063232,
        "value": [
          0.8,
          0.2
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.5,
          0.5
        ]
      },
      {
        "left": 20,
        "right": 21,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.2222222222222222,
          0.7777777777777778
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.2,
          0.8
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.25,
          0.75
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 12,
        "feature": 10,
        "threshold": 4.858788728713989,
        "value": [
          0.9997450764770569,
          0.0002549235229431171
        ]
      },
      {
        "left": 2,
        "right": 11,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9997700632326111,
          0.00022993676738896805
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 2,
        "threshold": 3.5,
        "value": [
          0.9998525283882852,
          0.00014747161171474492
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 7,
        "threshold": 0.2905701696872711,
        "value": [
          0.9998612754906286,
          0.000138724509371403
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 10,
        "threshold": 4.1529457569122314,
        "value": [
          0.9998720812259133,
          0.00012791877408666622
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999136221655686,
          8.637783443147506e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9966476040228752,
          0.0033523959771248274
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.9967462039045553,
          0.0032537960954446853
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9992721979621543,
          0.000727802037845706
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.6111111111111112,
          0.3888888888888889
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 24,
        "feature": 2,
        "threshold": 3.5,
        "value": [
          0.9997075877236828,
          0.00029241227631710486
        ]
      },
      {
        "left": 2,
        "right": 11,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9997188311874946,
          0.0002811688125053891
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9998009559123605,
          0.00019904408763948736
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 0,
        "threshold": 42.5,
        "value": [
          0.9998635398513711,
          0.0001364601486288885
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 2,
        "threshold": 1.5,
        "value": [
          0.9999072445747477,
          9.275542525228849e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999788764823428,
          2.112351765714841e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9993271599306632,
          0.0006728400693367393
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 1,
        "threshold": 32.0,
        "value": [
          0.9639546858908342,
          0.03604531410916581
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9739854318418314,
          0.026014568158168574
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 12,
        "right": 19,
        "feature": 0,
        "threshold": 39.0,
        "value": [
          0.9532908704883227,
          0.04670912951167728
        ]
      },
      {
        "left": 13,
        "right": 16,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.9948109710896961,
          0.005189028910303929
        ]
      },
      {
        "left": 14,
        "right": 15,
        "feature": 1,
        "threshold": 24.5,
        "value": [
          0.9962630792227205,
          0.0037369207772795215
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9983870967741936,
          0.0016129032258064516
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9693877551020408,
          0.030612244897959183
        ]
      },
      {
        "left": 17,
        "right": 18,
        "feature": 0,
        "threshold": 32.5,
        "value": [
          0.8181818181818182,
          0.18181818181818182
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.3333333333333333,
          0.6666666666666666
        ]
      },
      {
        "left": 20,
        "right": 23,
        "feature": 10,
        "threshold": 4.294977426528931,
        "value": [
          0.078125,
          0.921875
        ]
      },
      {
        "left": 21,
        "right": 22,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.45454545454545453,
          0.5454545454545454
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.625,
          0.375
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 20,
        "feature": 0,
        "threshold": 54.5,
        "value": [
          0.9996888433469959,
          0.00031115665300409875
        ]
      },
      {
        "left": 2,
        "right": 9,
        "feature": 0,
        "threshold": 41.5,
        "value": [
          0.9997587961302401,
          0.0002412038697599084
        ]
      },
      {
        "left": 3,
        "right": 8,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9998798134103195,
          0.00012018658968047894
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 1,
        "threshold": 32.5,
        "value": [
          0.9998860724153775,
          0.00011392758462253037
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9998885760393414,
          0.0001114239606585782
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999084423663509,
          9.155763364906084e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9888811674774148,
          0.011118832522585128
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 10,
        "right": 15,
        "feature": 4,
        "threshold": 0.5,
        "value": [
          0.9304659498207886,
          0.06953405017921147
        ]
      },
      {
        "left": 11,
        "right": 14,
        "feature": 3,
        "threshold": 2.0,
        "value": [
          0.9974768713204374,
          0.002523128679562658
        ]
      },
      {
        "left": 12,
        "right": 13,
        "feature": 6,
        "threshold": 0.5,
        "value": [
          0.9991575400168492,
          0.0008424599831508003
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9987593052109182,
          0.0012406947890818859
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 16,
        "right": 19,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.5436893203883495,
          0.4563106796116505
        ]
      },
      {
        "left": 17,
        "right": 18,
        "feature": 7,
        "threshold": 0.010204081423580647,
        "value": [
          0.7225806451612903,
          0.27741935483870966
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.7971014492753623,
          0.2028985507246377
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.11764705882352941,
          0.8823529411764706
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 21,
        "right": 22,
        "feature": 10,
        "threshold": 4.316798448562622,
        "value": [
          0.3563218390804598,
          0.6436781609195402
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": 23,
        "right": 28,
        "feature": 1,
        "threshold": 57.0,
        "value": [
          0.125,
          0.875
        ]
      },
      {
        "left": 24,
        "right": 27,
        "feature": 4,
        "threshold": 0.5,
        "value": [
          0.03508771929824561,
          0.9649122807017544
        ]
      },
      {
        "left": 25,
        "right": 26,
        "feature": 7,
        "threshold": 0.3472222238779068,
        "value": [
          0.3333333333333333,
          0.6666666666666666
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.6666666666666666,
          0.3333333333333333
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 29,
        "right": 30,
        "feature": 1,
        "threshold": 71.0,
        "value": [
          0.8571428571428571,
          0.14285714285714285
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": 31,
        "right": 32,
        "feature": 2,
        "threshold": 2.0,
        "value": [
          0.5,
          0.5
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          1.0,
          0.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 14,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9996913425972208,
          0.00030865740277916624
        ]
      },
      {
        "left": 2,
        "right": 13,
        "feature": 4,
        "threshold": 2.5,
        "value": [
          0.9998312769956806,
          0.0001687230043193089
        ]
      },
      {
        "left": 3,
        "right": 8,
        "feature": 4,
        "threshold": 1.5,
        "value": [
          0.9998450226654352,
          0.0001549773345648199
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 2,
        "threshold": 2.5,
        "value": [
          0.9998685383467383,
          0.00013146165326175142
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 1,
        "threshold": 33.5,
        "value": [
          0.9998722939143042,
          0.00012770608569579158
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9999134949181399,
          8.650508186013507e-05
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9691011235955056,
          0.03089887640449438
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 9,
        "right": 12,
        "feature": 2,
        "threshold": 3.5,
        "value": [
          0.9864768683274021,
          0.013523131672597865
        ]
      },
      {
        "left": 10,
        "right": 11,
        "feature": 10,
        "threshold": 4.2117533683776855,
        "value": [
          0.9892933618843683,
          0.010706638115631691
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9956803455723542,
          0.004319654427645789
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.25,
          0.75
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ],
    [
      {
        "left": 1,
        "right": 16,
        "feature": 10,
        "threshold": 4.858788728713989,
        "value": [
          0.9997100869739078,
          0.00028991302609217236
        ]
      },
      {
        "left": 2,
        "right": 15,
        "feature": 3,
        "threshold": 1.5,
        "value": [
          0.9997288262676123,
          0.0002711737323877659
        ]
      },
      {
        "left": 3,
        "right": 10,
        "feature": 0,
        "threshold": 63.0,
        "value": [
          0.9998212837326954,
          0.00017871626730454627
        ]
      },
      {
        "left": 4,
        "right": 7,
        "feature": 1,
        "threshold": 33.5,
        "value": [
          0.9998387741838725,
          0.00016122581612758086
        ]
      },
      {
        "left": 5,
        "right": 6,
        "feature": 0,
        "threshold": 43.0,
        "value": [
          0.9998836177606806,
          0.0001163822393194267
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9998873716036282,
          0.00011262839637186393
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": 8,
        "right": 9,
        "feature": 8,
        "threshold": 0.5,
        "value": [
          0.9650145772594753,
          0.03498542274052478
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.9676470588235294,
          0.03235294117647059
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.6666666666666666,
          0.3333333333333333
        ]
      },
      {
        "left": 11,
        "right": 14,
        "feature": 4,
        "threshold": 0.5,
        "value": [
          0.5483870967741935,
          0.45161290322580644
        ]
      },
      {
        "left": 12,
        "right": 13,
        "feature": 0,
        "threshold": 67.5,
        "value": [
          0.7727272727272727,
          0.22727272727272727
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.8947368421052632,
          0.10526315789473684
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      },
      {
        "left": -1,
        "right": -1,
        "feature": -2,
        "threshold": -2.0,
        "value": [
          0.0,
          1.0
        ]
      }
    ]
  ]
};

//
// ⬇️  ONLY LINE YOU NEED TO EDIT — paste your Google Safe Browsing API key here:
const DEFAULT_API_KEY = 'YOUR_API_KEY_HERE';
// Get a free key at: https://developers.google.com/safe-browsing/v4/get-started
// ────────────────────────────────────────────────────────────────────────────

const SAFE_BROWSING_ENDPOINT =
    'https://safebrowsing.googleapis.com/v4/threatMatches:find';

// Badge appearance per risk level
const BADGE = {
    LOW:     { text: '✓',    color: '#2ecc71' },
    MEDIUM:  { text: 'MED',  color: '#f39c12' },
    HIGH:    { text: 'HIGH', color: '#e74c3c' },
    UNKNOWN: { text: '?',    color: '#8b949e' },
};

// ── Settings initialisation ──────────────────────────────────────────────────
async function initSettings() {
    const stored = await chrome.storage.local.get(['phishingMode', 'safeBrowsingApiKey']);

    // Seed default mode
    if (!stored.phishingMode) {
        await chrome.storage.local.set({ phishingMode: 'accurate' });
        console.log('[DCG Phishing] Default mode set: accurate');
    }

    // Auto-seed API key from hardcoded constant if not already stored
    if (!stored.safeBrowsingApiKey && DEFAULT_API_KEY !== 'YOUR_API_KEY_HERE') {
        await chrome.storage.local.set({ safeBrowsingApiKey: DEFAULT_API_KEY });
        console.log('[DCG Phishing] API key auto-loaded from build constant.');
    }
}

// ── Badge helper ─────────────────────────────────────────────────────────────
function updateBadge(risk, tabId) {
    const b = BADGE[risk] || BADGE.UNKNOWN;
    const opts = tabId ? { tabId } : {};
    chrome.action.setBadgeText({ text: b.text, ...opts }).catch(() => {});
    chrome.action.setBadgeBackgroundColor({ color: b.color, ...opts }).catch(() => {});
}

function clearBadge(tabId) {
    const opts = tabId ? { tabId } : {};
    chrome.action.setBadgeText({ text: '', ...opts }).catch(() => {});
}

// ── Trusted Domain & TLD Allowlist ───────────────────────────────────────────
const TRUSTED_DOMAINS = [
    "google.com", "youtube.com", "wikipedia.org", "amazon.com", "microsoft.com",
    "apple.com", "github.com", "stackoverflow.com", "linkedin.com", "facebook.com",
    "twitter.com", "instagram.com", "whatsapp.com", "netflix.com", "paypal.com",
    "dropbox.com", "cloudflare.com", "openai.com"
];

const SAFE_TLDS = [".com", ".org", ".net", ".edu", ".gov"];

/** Returns true if the hostname exactly matches or is a subdomain of a trusted domain. */
function isTrustedDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        return TRUSTED_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith("." + domain)
        );
    } catch {
        return false;
    }
}

/** Returns true if the hostname ends with a safe TLD. */
function hasSafeTLD(hostname) {
    return SAFE_TLDS.some(tld => hostname.endsWith(tld));
}

// ── Core check (exported so popup can call it via message) ───────────────────
async function checkUrl(url, tabId) {
    if (!url || !url.startsWith('http')) return null;

    const { phishingMode, safeBrowsingApiKey } =
        await chrome.storage.local.get(['phishingMode', 'safeBrowsingApiKey']);

    const mode   = phishingMode || 'accurate';
    const apiKey = safeBrowsingApiKey || DEFAULT_API_KEY;

    let hostname = '';
    try { hostname = new URL(url).hostname; } catch { /* fail safe */ }

    console.log(`[DCG] Analysing: ${url} (Mode: ${mode})`);

    try {
        // 1. Get base probability score from the engine
        let result = (mode === 'accurate') 
            ? await checkWithSafeBrowsing(url, apiKey)
            : await checkWithPrivacyMode(url);

        let riskScore = result.score;
        let reason    = result.reason;

        // 2. Apply Allowlist Multiplier
        if (isTrustedDomain(url) && hasSafeTLD(hostname)) {
            console.log('[DCG Security] Trusted domain detected. Reducing risk score (0.3x multiplier).');
            riskScore *= 0.3;
        }

        // 3. Final Classification based on security thresholds
        let risk = 'LOW';
        if (riskScore >= 0.7) {
            risk = 'HIGH';
        } else if (riskScore >= 0.3) {
            risk = 'MEDIUM';
        }

        const finalResult = { risk, reason, url, score: riskScore };

        // 4. Trigger UI alerts for high risk
        if (risk === 'HIGH') {
            showPhishingWarning(url, risk, reason, tabId);
        }

        return finalResult;

    } catch (err) {
        console.error('[DCG Phishing] Pipeline crash:', err);
        return { risk: 'UNKNOWN', reason: `Internal error: ${err.message}` };
    }
}

// ── Safe Browsing (Accurate Mode) ────────────────────────────────────────────
async function checkWithSafeBrowsing(url, apiKey) {
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return { score: 0.0, reason: 'API key not configured' };
    }

    try {
        const response = await fetch(
            `${SAFE_BROWSING_ENDPOINT}?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client: { clientId: 'dcg-extension', clientVersion: '1.0' },
                    threatInfo: {
                        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                        platformTypes: ['ANY_PLATFORM'],
                        threatEntryTypes: ['URL'],
                        threatEntries: [{ url }]
                    }
                })
            }
        );

        if (!response.ok) return { score: 0.0, reason: 'API unreachable' };

        const data = await response.json();
        if (data.matches && data.matches.length > 0) {
            return { score: 1.0, reason: `Safe Browsing: ${data.matches[0].threatType}` };
        }

        return { score: 0.0, reason: 'Safe Browsing: Clear' };

    } catch (err) {
        return { score: 0.0, reason: 'Network failure' };
    }
}

// ── Privacy Mode (Local ML Inference) ─────────────────────────────────────────

/** Calculates Shannon entropy of a string. */
function calculateEntropy(str) {
    if (!str) return 0;
    const len = str.length;
    const counts = {};
    for (const char of str) {
        counts[char] = (counts[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in counts) {
        const p = counts[char] / len;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

/** Extracts features from a URL for the ML model. Matches Python logic. */
function extractFeatures(url) {
    let hostname = '';
    try {
        hostname = new URL(url).hostname;
    } catch {
        // Fallback for messy URLs
        const match = url.match(/:\/\/(.[^/]+)/);
        hostname = match ? match[1] : '';
    }

    const features = [];
    // 1. url_length
    features.push(url.length);
    // 2. hostname_length
    features.push(hostname.length);
    // 3. dot_count
    features.push((url.match(/\./g) || []).length);
    // 4. slash_count (only in path/query)
    let slashCount = 0;
    try {
        const urlObj = new URL(url);
        const pathAndQuery = urlObj.pathname + urlObj.search;
        slashCount = (pathAndQuery.match(/\//g) || []).length;
    } catch {
        // Fallback for non-standard URLs
        slashCount = (url.match(/\//g) || []).length;
    }
    features.push(slashCount);
    // 5. subdomain_count
    const hostDots = (hostname.match(/\./g) || []).length;
    features.push(hostDots > 0 ? hostDots - 1 : 0);
    // 6. has_at
    features.push(url.includes('@') ? 1 : 0);
    // 7. has_dash
    features.push(url.includes('-') ? 1 : 0);
    // 8. digit_ratio
    const digits = (url.match(/\d/g) || []).length;
    features.push(url.length > 0 ? digits / url.length : 0);
    // 9. keyword_count
    const keywords = ['login', 'verify', 'secure', 'bank', 'update'];
    const lowerUrl = url.toLowerCase();
    let kwCount = 0;
    keywords.forEach(kw => {
        const matches = lowerUrl.match(new RegExp(kw, 'g'));
        if (matches) kwCount += matches.length;
    });
    features.push(kwCount);
    // 10. risky_tld
    const risky = ['.xyz', '.top', '.click', '.ru'];
    const lowerHost = hostname.toLowerCase();
    features.push(risky.some(tld => lowerHost.endsWith(tld)) ? 1 : 0);
    // 11. entropy
    features.push(calculateEntropy(url));

    return features;
}

/** Traverses the Random Forest model to get a phishing probability. */
function runMLInference(features) {
    let totalPhishProb = 0;

    ML_MODEL.trees.forEach(tree => {
        let nodeIdx = 0;
        while (true) {
            const node = tree[nodeIdx];
            if (node.feature === -2) {
                // Leaf node: extract phishing probability (class 1)
                totalPhishProb += node.value[1];
                break;
            }
            // Continuous feature split
            if (features[node.feature] <= node.threshold) {
                nodeIdx = node.left;
            } else {
                nodeIdx = node.right;
            }
        }
    });

    return totalPhishProb / ML_MODEL.n_trees;
}

/** Performs local ML analysis without external API calls. */
function checkWithPrivacyMode(url) {
    try {
        const features = extractFeatures(url);
        const score = runMLInference(features);
        const confidence = Math.round(score * 100);

        return { 
            score, 
            reason: `Local ML: ${confidence}% phishing match` 
        };
    } catch (err) {
        return { score: 0.5, reason: 'ML failure' }; // Conservative score on error
    }
}

// ── Warning broadcast ─────────────────────────────────────────────────────────
function showPhishingWarning(url, risk, reason, tabId) {
    console.warn(`[DCG] ⚠️  Phishing Warning — ${url}`);
    console.warn(`[DCG] Risk: ${risk} | ${reason}`);

    // 1. Broadcast to popup
    chrome.runtime.sendMessage({ type: 'PHISHING_ALERT', url, risk, reason })
        .catch(() => { /* popup not open — that's fine */ });

    // 2. Persist to storage
    chrome.storage.local.set({
        lastPhishingAlert: { url, risk, reason, ts: Date.now() }
    });

    // 3. If HIGH risk, inject the warning overlay into the page itself
    if (risk === 'HIGH' && tabId) {
        injectWarning(tabId, url, reason);
    }
}

/** Injects the premium warning overlay into the target tab. */
async function injectWarning(tabId, url, reason) {
    try {
        console.log(`[DCG Phishing] Injecting warning overlay into tab ${tabId}`);
        await chrome.scripting.executeScript({
            target: { tabId },
            func: showWarningOverlay,
            args: [url, reason]
        });
    } catch (err) {
        console.error('[DCG Phishing] Failed to inject warning overlay:', err);
    }
}

// ── Tab listener ──────────────────────────────────────────────────────────────

/** Returns true only if the tab still exists at call time. */
async function tabExists(tabId) {
    try {
        await chrome.tabs.get(tabId);
        return true;
    } catch {
        return false;
    }
}

function registerTabListener() {
    // URL change — check after the async API call whether tab is still open
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
        if (!changeInfo.url) return;

        const result = await checkUrl(changeInfo.url, tabId);
        if (!result) return;

        // Tab may have closed while Safe Browsing was running — bail out silently
        if (!(await tabExists(tabId))) return;

        // Cache result
        const { tabRiskCache = {} } = await chrome.storage.local.get('tabRiskCache');
        tabRiskCache[tabId] = { url: changeInfo.url, ...result, ts: Date.now() };
        chrome.storage.local.set({ tabRiskCache });

        updateBadge(result.risk, tabId);
    });

    // Clean up cache when tab closes — do NOT touch the badge (tab is gone)
    chrome.tabs.onRemoved.addListener((tabId) => {
        chrome.storage.local.get('tabRiskCache', ({ tabRiskCache }) => {
            if (!tabRiskCache) return;
            delete tabRiskCache[tabId];
            chrome.storage.local.set({ tabRiskCache });
        });
    });

    // When user switches to a tab, restore that tab's badge
    chrome.tabs.onActivated.addListener(async ({ tabId }) => {
        if (!(await tabExists(tabId))) return;
        const { tabRiskCache } = await chrome.storage.local.get('tabRiskCache');
        const entry = tabRiskCache?.[tabId];
        if (entry) updateBadge(entry.risk, tabId);
        else clearBadge(tabId);
    });

    console.log('[DCG Phishing] Tab listeners registered.');
}

// ── Public API ────────────────────────────────────────────────────────────────
export const PhishingDetector = {
    /** Call once from background.js at startup. */
    init() {
        initSettings();
        registerTabListener();
        console.log('[DCG Phishing] Detector initialised.');
    },

    /** Called by background.js message handler so popup can request a live check. */
    checkUrl
};